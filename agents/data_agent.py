import pandas as pd
import pdfplumber
import os
from typing import Dict, Any

class DataAgent:
    """
    Step 1: Extracts, cleans, and organizes financial data.
    """
    SYSTEM_PROMPT = """
    You are DataAgent, responsible for collecting, cleaning, validating, and structuring user financial data.

    Your Responsibilities:
    - Normalize transaction data
    - Categorize expenses
    - Detect salary & income patterns
    - Convert messy user inputs into structured JSON
    - Extract metadata from bank statements, SMS, UPI labels
    - Validate missing/incorrect values
    - Output clean, reliable financial data for downstream agents
    """

    def __init__(self, api_key: str = None):
        self.api_key = api_key

    def ingest_data(self, file_path: str, api_key: str = None) -> Dict[str, Any]:
        """
        Determines file type and routes to appropriate parser.
        """
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == '.csv':
            return self._parse_csv(file_path)
        elif ext == '.pdf':
            return self._parse_pdf(file_path)
        else:
            return {"error": "Unsupported file format"}

    def _parse_csv(self, file_path: str) -> Dict[str, Any]:
        try:
            df = pd.read_csv(file_path)
            # Basic cleaning
            df.columns = [c.lower().replace(" ", "_") for c in df.columns]
            df = df.fillna(0)
            
            # Store to DB (Mock)
            self._store_to_db(df)
            
            return {
                "rows": len(df),
                "columns": list(df.columns),
                "preview": df.head().to_dict(orient='records')
            }
        except Exception as e:
            return {"error": str(e)}

    def _parse_pdf(self, file_path: str) -> Dict[str, Any]:
        text_content = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    text_content += page.extract_text() + "\n"
            
            # Very basic extraction logic (would need regex for real bank statements)
            return {
                "pages": len(pdf.pages),
                "content_preview": text_content[:500]
            }
        except Exception as e:
            return {"error": str(e)}

    def _store_to_db(self, df: pd.DataFrame):
        """
        Mock function to store data in PostgreSQL.
        """
        print(f"DataAgent: Storing {len(df)} rows to database...")

    def fetch_transactions(self) -> list:
        """
        Fetches transactions from the external source.
        """
        import requests
        external_api_url = "https://kylan-unbricked-superdevilishly.ngrok-free.dev/table/Daniel_Robinson"
        try:
            response = requests.get(external_api_url)
            if response.status_code == 200:
                data = response.json()
                if "rows" in data:
                    return data["rows"]
        except Exception as e:
            print(f"DataAgent Error: {e}")
        
        # Fallback Mock Data (Safety Net)
        print("DataAgent: Using fallback mock data.")
        return [
            {"date": "2024-11-01", "amount": 5000, "type": "Credit", "description": "Salary"},
            {"date": "2024-11-05", "amount": 1200, "type": "Debit", "description": "Rent"},
            {"date": "2024-11-10", "amount": 300, "type": "Debit", "description": "Groceries"},
            {"date": "2024-11-15", "amount": 150, "type": "Debit", "description": "Utilities"},
            {"date": "2024-12-01", "amount": 5000, "type": "Credit", "description": "Salary"},
            {"date": "2024-12-05", "amount": 1200, "type": "Debit", "description": "Rent"},
            {"date": "2024-12-10", "amount": 400, "type": "Debit", "description": "Shopping"},
            {"date": "2025-01-01", "amount": 5200, "type": "Credit", "description": "Salary + Bonus"},
            {"date": "2025-01-05", "amount": 1200, "type": "Debit", "description": "Rent"},
            {"running_balance": 15000} # Ensure we have a running balance for baseline
        ]
