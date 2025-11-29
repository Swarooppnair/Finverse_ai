import os
import json
import requests

class RiskAgent:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")

    def analyze_risk(self, transactions, forecast_data):
        """
        Analyzes financial risk based on transactions and forecast.
        Returns risk level and specific risk factors.
        """
        prompt = f"""
        You are a Financial Risk Assessment Agent.
        Analyze the following financial data to detect risks.
        
        Data Summary:
        - Transaction Count: {len(transactions)}
        - Forecast Data: {json.dumps(forecast_data)[:500]}...

        Identify:
        1. Burn Rate Risks (High spending vs income)
        2. Liquidity Risks (Low cash balance)
        3. Volatility Risks (Irregular income/expenses)
        4. Dependency Risks (Reliance on single income source)

        Return JSON:
        {{
            "risk_level": "Low" | "Medium" | "High" | "Critical",
            "risk_score": <0-100>,
            "factors": ["list", "of", "risk", "factors"],
            "runway_months": <estimated_runway>
        }}
        """
        
        try:
            response = self._call_llm(prompt)
            return json.loads(response.replace("```json", "").replace("```", "").strip())
        except Exception as e:
            print(f"Risk Analysis failed: {e}")
            return {"risk_level": "Unknown", "risk_score": 0, "factors": [], "runway_months": 0}

    def _call_llm(self, prompt):
        if not self.api_key:
            return "{}"
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Finverse Risk Agent"
        }
        
        data = {
            "model": "nvidia/nemotron-nano-12b-v2-vl:free",
            "messages": [{"role": "user", "content": prompt}]
        }
        
        resp = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        if resp.status_code == 200:
            return resp.json()['choices'][0]['message']['content']
        raise Exception(f"LLM Call failed: {resp.text}")
