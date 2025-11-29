import pandas as pd
from typing import Dict, Any, List

class InsightAgent:
    """
    Step 6: Prepares data for visualization.
    """
    SYSTEM_PROMPT = """
    You are InsightAgent, responsible for creating contextual insights, explanations, and reasoning based on all other agents.

    Your Responsibilities:
    - Combine data from DataAgent, ForecastAgent, AnomalyAgent, AdviceAgent
    - Generate easy-to-understand summaries
    - Produce financial health score
    - Explain cashflow patterns
    - Highlight future risks & opportunities
    """

    def __init__(self, api_key: str = None):
        self.api_key = api_key

    def generate_insights(self, transactions: List[Dict[str, Any]], currency: str = "USD", api_key: str = None) -> Dict[str, Any]:
        """
        Aggregates key metrics for the dashboard using real data.
        """
        if not transactions:
            return {
                "monthly_burn_rate": 0,
                "runway_months": 0,
                "top_expense_category": "None",
                "savings_rate": "0%",
                "net_worth_trend": "No data"
            }

        df = pd.DataFrame(transactions)
        
        # Ensure numeric
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0)
        
        # Filter expenses
        expenses = df[df['type'] == 'Debit']
        income = df[df['type'] == 'Credit']
        
        total_expense = expenses['amount'].sum()
        total_income = income['amount'].sum()
        
        # Monthly Burn Rate (Average monthly expense)
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            df['month'] = df['date'].dt.to_period('M')
            num_months = df['month'].nunique()
            monthly_burn_rate = total_expense / num_months if num_months > 0 else total_expense
        else:
            monthly_burn_rate = total_expense

        # Top Expense Category
        if not expenses.empty and 'description' in expenses.columns:
             # Using description as category since category might be missing
            top_category = expenses.groupby('description')['amount'].sum().idxmax()
        else:
            top_category = "None"

        # Savings Rate
        savings_rate = ((total_income - total_expense) / total_income * 100) if total_income > 0 else 0
        
        # Runway (Assuming current balance = total_income - total_expense)
        current_balance = total_income - total_expense
        runway_months = (current_balance / monthly_burn_rate) if monthly_burn_rate > 0 else 0

        return {
            "monthly_burn_rate": round(monthly_burn_rate, 2),
            "runway_months": round(runway_months, 1),
            "top_expense_category": top_category,
            "savings_rate": f"{round(savings_rate, 1)}%",
            "net_worth_trend": f"Net flow: {currency} {current_balance:,.2f}" # Simple trend for now
        }
