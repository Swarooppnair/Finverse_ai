import pandas as pd
from typing import List, Dict, Any

class AnomalyAgent:
    """
    Step 3: Detects irregularities and fraud.
    """
    SYSTEM_PROMPT = """
    You are AnomalyAgent, responsible for detecting unusual, risky, or abnormal financial activity.

    Your Responsibilities:
    - Detect unexplained spending spikes
    - Identify bill payment failures or overdue bills
    - Detect pattern breaks
    - Point out duplicate charges or fraud-like behaviors
    - Spot unusually high UPI/credit card usage
    """

    def __init__(self, api_key: str = None):
        self.api_key = api_key

    def detect_anomalies(self, data: List[Dict[str, Any]], currency: str = "USD", api_key: str = None) -> List[Dict[str, Any]]:
        """
        Returns a list of flagged transactions.
        """
        if not data:
            return []

        df = pd.DataFrame(data)

        # Dynamic threshold based on currency
        # Base threshold is 1000 USD
        base_threshold = 1000
        
        # Approximate multipliers (simplified)
        multipliers = {
            "USD": 1, "EUR": 0.9, "GBP": 0.8, "INR": 83, "JPY": 150,
            "AUD": 1.5, "CAD": 1.35, "CHF": 0.9, "CNY": 7.2, "NZD": 1.6,
            "SEK": 10.5, "KRW": 1300, "SGD": 1.35, "NOK": 10.5, "MXN": 17,
            "RUB": 90, "ZAR": 19, "TRY": 27, "BRL": 5, "AED": 3.67,
            "HKD": 7.8
        }
        
        threshold = base_threshold * multipliers.get(currency, 1)

        # Simple anomaly detection: High amount transactions
        if 'amount' in df.columns:
            # Ensure amount is numeric
            df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0)
            
            high_value_txns = df[df['amount'] > threshold].copy()
            
            anomalies = []
            for _, row in high_value_txns.iterrows():
                anomalies.append({
                    "id": row.get('transaction_id', 'unknown'),
                    "date": row.get('date', 'unknown'),
                    "amount": row.get('amount', 0),
                    "description": row.get('description', 'Unknown'),
                    "risk_score": 0.7, 
                    "reason": f"High value transaction (>{currency} {threshold})"
                })
                
            return anomalies
        return []
