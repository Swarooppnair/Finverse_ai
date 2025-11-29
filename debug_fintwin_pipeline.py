import os
import json
import pandas as pd
from agents.data_agent import DataAgent
from agents.forecast_agent import ForecastAgent
from agents.risk_agent import RiskAgent
from agents.twin_analysis_agent import TwinAnalysisAgent
from agents.advice_agent import AdviceAgent

# Mock API Key (User can set this env var or we can try without if agents support it)
# os.environ["OPENROUTER_API_KEY"] = "..." 

def run_debug_pipeline():
    print("--- Starting FinTwin Debug Pipeline ---")
    
    # Initialize Agents
    data_agent = DataAgent()
    forecast_agent = ForecastAgent()
    risk_agent = RiskAgent()
    twin_agent = TwinAnalysisAgent()
    advice_agent = AdviceAgent()

    # Step 1: Data
    print("\n[1] Fetching Transactions...")
    try:
        transactions = data_agent.fetch_transactions()
        print(f"SUCCESS: Fetched {len(transactions)} transactions.")
        if len(transactions) > 0:
            print(f"Sample: {transactions[0]}")
    except Exception as e:
        print(f"FAILURE: DataAgent error: {e}")
        return

    # Step 2: Forecast
    print("\n[2] Generating Forecast...")
    try:
        forecast = forecast_agent.predict_income(transactions)
        print(f"SUCCESS: Forecast keys: {list(forecast.keys())}")
        print(f"Forecast Data (first 2 months): {json.dumps({k: v[:2] if isinstance(v, list) else v for k,v in forecast.items()}, indent=2)}")
    except Exception as e:
        print(f"FAILURE: ForecastAgent error: {e}")
        return

    # Step 3: Risk
    print("\n[3] Analyzing Risk...")
    try:
        risk_analysis = risk_agent.analyze_risk(transactions, forecast)
        print(f"SUCCESS: Risk Analysis: {json.dumps(risk_analysis, indent=2)}")
    except Exception as e:
        print(f"FAILURE: RiskAgent error: {e}")
        # Continue even if risk fails, as it might be non-critical for basic chart
        risk_analysis = {"risk_level": "Unknown"}

    # Step 4: Twin Analysis
    print("\n[4] Running Twin Simulation...")
    try:
        query = "simulate next 12 months"
        simulation = twin_agent.simulate_scenario(query, transactions, forecast, risk_analysis)
        print(f"SUCCESS: Simulation Result Keys: {list(simulation.keys())}")
        print(f"Timeline Length: {len(simulation.get('timeline', []))}")
        if len(simulation.get('timeline', [])) > 0:
            print(f"First Timeline Entry: {simulation['timeline'][0]}")
    except Exception as e:
        print(f"FAILURE: TwinAnalysisAgent error: {e}")
        return

    # Step 5: Advice
    print("\n[5] Generating Advice...")
    try:
        advice_text = advice_agent.get_advice(
            f"Based on this simulation: {json.dumps(simulation)[:500]}", 
            context={"risk": risk_analysis}
        )
        print(f"SUCCESS: Advice generated (length {len(advice_text)})")
        print(f"Advice Preview: {advice_text[:100]}...")
    except Exception as e:
        print(f"FAILURE: AdviceAgent error: {e}")

    print("\n--- Pipeline Complete ---")

if __name__ == "__main__":
    run_debug_pipeline()
