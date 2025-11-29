import pandas as pd
import numpy as np
from typing import Dict, Any, List

class ForecastAgent:
    """
    Step 2: Predicts future income, expenses, and cashflow.
    """
    SYSTEM_PROMPT = """
    You are ForecastAgent, responsible for predicting future financial outcomes using statistical and AI forecasting models.

    Your Responsibilities:
    - Forecast monthly income
    - Forecast monthly expenses
    - Predict balance over next 12 months
    - Identify seasonal patterns
    - Generate best-case, worst-case, and expected scenarios
    """

    def __init__(self, api_key: str = None):
        self.api_key = api_key

    def predict_income(self, data: List[Dict[str, Any]], api_key: str = None) -> Dict[str, Any]:
        """
        Generates income forecasts using provided data.
        """
        if not data:
             # Fallback if no data
            months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
            return {
                "labels": months,
                "income": [0]*6,
                "expense": [0]*6,
                "net_cashflow": [0]*6
            }

        df = pd.DataFrame(data)

        # Process Date
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            df['month'] = df['date'].dt.strftime('%b %Y')
        else:
            return {}
        
        # Aggregate by month
        monthly_stats = df.groupby(['month', 'type'])['amount'].sum().unstack(fill_value=0)
        
        # Ensure columns exist
        if 'Credit' not in monthly_stats.columns: monthly_stats['Credit'] = 0
        if 'Debit' not in monthly_stats.columns: monthly_stats['Debit'] = 0
        
        # Sort by date (approximation)
        monthly_stats = monthly_stats.reset_index()
        
        # Take the last 6 months of actuals for baseline
        recent_data = monthly_stats.tail(6)
        
        # Calculate averages from historical data
        avg_income = recent_data['Credit'].mean()
        avg_expense = recent_data['Debit'].mean()
        
        # Project 12 months forward
        future_months = []
        future_income = []
        future_expense = []
        
        last_date = pd.to_datetime(recent_data['month'].iloc[-1])
        
        for i in range(1, 13):
            next_date = last_date + pd.DateOffset(months=i)
            future_months.append(next_date.strftime('%b %Y'))
            # Add some simple variance/seasonality if desired, for now use average
            future_income.append(round(avg_income, 2))
            future_expense.append(round(avg_expense, 2))

        return {
            "labels": future_months,
            "income": future_income,
            "expense": future_expense,
            "net_cashflow": [i - e for i, e in zip(future_income, future_expense)]
        }

    def predict_expenses(self) -> Dict[str, Any]:
        # Similar logic
        return {}
