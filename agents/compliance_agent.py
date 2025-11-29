from typing import List, Dict, Any

class ComplianceAgent:
    """
    Step 4: Checks transactions against regulations (RBI, GST, SEBI).
    """
    SYSTEM_PROMPT = """
    You are ComplianceAgent, responsible for ensuring all financial actions follow legal, banking, and regulatory rules.

    Your Responsibilities:
    - Validate UPI transfer limits
    - Validate bank daily/monthly limits
    - Check RBI compliance
    - Identify tax implications
    - Block actions that violate safety norms
    """

    def __init__(self, api_key: str = None):
        # Initialize RAG engine here
        self.api_key = api_key
        self.rag_url = "https://postlabially-overinstructive-aurore.ngrok-free.dev"
        self.rag_documents = []
        self._fetch_rag_documents()

    def _fetch_rag_documents(self):
        """
        Fetches compliance documents from the RAG source.
        """
        import requests
        try:
            print(f"ComplianceAgent: Fetching RAG documents from {self.rag_url}...")
            response = requests.get(self.rag_url, timeout=5)
            if response.status_code == 200:
                # Assuming the response is a list of strings or objects
                data = response.json()
                if isinstance(data, list):
                    self.rag_documents = data
                elif isinstance(data, dict) and "documents" in data:
                    self.rag_documents = data["documents"]
                print(f"ComplianceAgent: Loaded {len(self.rag_documents)} RAG documents.")
            else:
                print(f"ComplianceAgent: RAG fetch failed with status {response.status_code}")
        except Exception as e:
            print(f"ComplianceAgent: RAG fetch error: {e}")

    def check_compliance(self, transaction: Dict[str, Any], currency: str = "USD", api_key: str = None) -> Dict[str, Any]:
        """
        Verifies if a transaction complies with rules.
        """
        # Rule: High value transactions require PAN (or equivalent ID)
        # Threshold adjusted for currency (simplified)
        threshold = 200000 if currency == "INR" else 2500 # Approx 2.5k USD
        
        # 1. Static Rule Check
        if transaction.get("amount", 0) > threshold and not transaction.get("pan_provided"):
            return {
                "status": "Fail",
                "reason": f"High value transaction (>{currency} {threshold}) requires ID/PAN."
            }
            
        # 2. RAG-based Compliance Check (if documents exist)
        if self.rag_documents and self.api_key:
            try:
                # Simple context construction (first 3 docs to avoid context limit)
                context = "\n\n".join([str(d) for d in self.rag_documents[:3]])
                
                prompt = f"""
                {self.SYSTEM_PROMPT}
                
                Analyze this transaction against the following compliance documents:
                
                --- RAG DOCUMENTS ---
                {context}
                --- END DOCUMENTS ---
                
                Transaction: {transaction}
                Currency: {currency}
                
                Is this transaction compliant?
                Return JSON: {{ "status": "Pass" | "Fail", "reason": "..." }}
                """
                
                response = self._call_llm(prompt)
                import json
                return json.loads(response.replace("```json", "").replace("```", "").strip())
            except Exception as e:
                print(f"ComplianceAgent: RAG check failed: {e}")
                # Fallback to Pass if RAG fails but static check passed
        
        return {"status": "Pass"}

    def _call_llm(self, prompt):
        import requests
        if not self.api_key:
            return "{}"
            
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "Finverse Compliance Agent"
        }
        
        data = {
            "model": "nvidia/nemotron-nano-12b-v2-vl:free",
            "messages": [{"role": "user", "content": prompt}]
        }
        
        resp = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        if resp.status_code == 200:
            return resp.json()['choices'][0]['message']['content']
        raise Exception(f"LLM Call failed: {resp.text}")

    def get_tax_rules(self, currency: str = "USD") -> Dict[str, Any]:
        """
        Returns tax policies based on the currency/country.
        """
        rules = {
            "USD": {
                "country": "United States",
                "tax_free_limit": 12000,
                "tax_rate": 0.22, # Simplified average
                "standard_deduction_rate": 0.12,
                "currency_symbol": "$"
            },
            "INR": {
                "country": "India",
                "tax_free_limit": 300000, # New regime approx
                "tax_rate": 0.30, # Max slab
                "standard_deduction_rate": 0.15, # Mock
                "currency_symbol": "₹"
            },
            "EUR": {
                "country": "Eurozone",
                "tax_free_limit": 10000,
                "tax_rate": 0.40,
                "standard_deduction_rate": 0.10,
                "currency_symbol": "€"
            },
            "GBP": {
                "country": "United Kingdom",
                "tax_free_limit": 12570,
                "tax_rate": 0.20,
                "standard_deduction_rate": 0.10,
                "currency_symbol": "£"
            }
        }
        
        # Default to USD rules if currency not found
        return rules.get(currency, rules["USD"])
