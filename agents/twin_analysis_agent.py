import os
import json
import requests

class TwinAnalysisAgent:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")

    def simulate_scenario(self, query, transactions, current_forecast, risk_analysis):
        """
        Simulates a financial scenario based on user query and current state.
        Generates a 12-month timeline and impact analysis.
        """
        prompt = f"""
        You are the FinTwin Analysis Engine.
        Simulate the user's "What-If" scenario on their digital twin.

        User Query: "{query}"
        
        Current State:
        - Recent Transactions: {len(transactions)} items
        - Baseline Forecast: {json.dumps(current_forecast)[:500]}...
        - Risk Profile: {json.dumps(risk_analysis)}

        Tasks:
        1. Interpret the scenario (e.g., "Buy a car for $20k", "Get a raise").
        2. Project the financial timeline for the next 12 months incorporating this change.
        3. Calculate the impact on cashflow and runway.

        Return JSON ONLY:
        {{
            "impact": "positive" | "negative" | "neutral",
            "cashflowChange": <net_change_amount>,
            "runwayChange": <months_change>,
            "timeline": [
                {{ "month": "Month 1", "balance": <projected_balance> }},
                ... (12 months)
            ]
        }}
        """
        
        try:
            response = self._call_llm(prompt)
            return json.loads(response.replace("```json", "").replace("```", "").strip())
        except Exception as e:
            print(f"Twin Analysis failed: {e}")
            return {
                "impact": "neutral", 
                "cashflowChange": 0, 
                "runwayChange": 0, 
                "timeline": []
            }

    def _call_llm(self, prompt):
        if not self.api_key:
            return "{}"
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Finverse Twin Agent"
        }
        
        data = {
            "model": "nvidia/nemotron-nano-12b-v2-vl:free",
            "messages": [{"role": "user", "content": prompt}]
        }
        
        resp = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        if resp.status_code == 200:
            return resp.json()['choices'][0]['message']['content']
        raise Exception(f"LLM Call failed: {resp.text}")
