import pandas as pd
from typing import Dict, Any, List
import datetime

class TaxAgent:
    """
    Step 4.5: Handles tax computations and filing preparation.
    """
    def __init__(self):
        pass

    def generate_tax_report(self, transactions: List[Dict[str, Any]], currency: str = "USD", api_key: str = None, compliance_agent: Any = None) -> Dict[str, Any]:
        """
        Computes estimated tax liability using real data and compliance rules.
        """
        if not transactions:
            return {
                "total_income": 0,
                "deductions": 0,
                "taxable_income": 0,
                "total_liability": 0,
                "filing_status": "Pending",
                "due_date": "Unknown",
                "alerts": ["No data available"]
            }

        # Get Tax Rules from Compliance Agent
        rules = {}
        if compliance_agent:
            rules = compliance_agent.get_tax_rules(currency)
        else:
            # Fallback defaults
            rules = {
                "country": "Unknown",
                "tax_free_limit": 10000,
                "tax_rate": 0.20,
                "standard_deduction_rate": 0.10
            }

        df = pd.DataFrame(transactions)
        df['amount'] = pd.to_numeric(df['amount'], errors='coerce').fillna(0)
        
        # Calculate Total Income
        income_txns = df[df['type'] == 'Credit']
        total_income = income_txns['amount'].sum()
        
        # Estimate Deductions based on rules
        deductions = total_income * rules["standard_deduction_rate"]
        
        taxable_income = max(0, total_income - deductions)
        
        # Calculate Tax Liability based on rules
        tax = 0
        if taxable_income > rules["tax_free_limit"]:
            tax = (taxable_income - rules["tax_free_limit"]) * rules["tax_rate"]
            
        return {
            "total_income": round(total_income, 2),
            "deductions": round(deductions, 2),
            "taxable_income": round(taxable_income, 2),
            "total_liability": round(tax, 2),
            "filing_status": "Pending",
            "due_date": f"{datetime.date.today().year + 1}-04-15",
            "alerts": [
                f"Tax Regime: {rules['country']}",
                f"Tax Free Limit: {currency} {rules['tax_free_limit']:,}",
                f"Estimated Liability: {currency} {tax:,.2f}"
            ]
        }
