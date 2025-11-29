import os
import requests
import json
from typing import Dict, Any

class AdviceAgent:
    """
    Step 5: The 'LLM CFO' providing personalized advice.
    """
    SYSTEM_PROMPT = """
    You are AdviceAgent, responsible for generating personalized, actionable financial advice based strictly on user data and forecasts.

    Your Responsibilities:
    - Provide savings optimization
    - Recommend expense reductions
    - Suggest investment allocation % (not specific securities)
    - Suggest budgeting tips
    - Provide step-by-step improvement plans
    """

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            print("Warning: OPENROUTER_API_KEY not found. AdviceAgent will run in mock mode.")

    def get_advice(self, user_query: str, context: Dict[str, Any], currency: str = "USD", api_key: str = None) -> str:
        """
        Generates financial advice based on query and context.
        """
        # Use passed key, or fallback to env var
        final_api_key = api_key or self.api_key
        
        if not final_api_key:
            return "I am currently in offline mode. Please configure my API key in settings to get real-time advice."

        prompt = f"""
        {self.SYSTEM_PROMPT}

        Context: {context}
        User Currency: {currency}
        User Query: {user_query}
        
        Provide professional, safe, and actionable financial advice.
        When mentioning monetary values, use the currency symbol for {currency}.
        """
        
        headers = {
            "Authorization": f"Bearer {final_api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Finverse 2.0",
        }
        
        data = {
            "model": "nvidia/nemotron-nano-12b-v2-vl:free",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        
        try:
            response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
            
            if response.status_code == 200:
                return response.json()['choices'][0]['message']['content']
            else:
                return f"Error generating advice: {response.text}"
        except Exception as e:
            return f"Error generating advice: {str(e)}"
