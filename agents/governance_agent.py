from typing import Dict, Any, List

class GovernanceAgent:
    """
    The Governance Agent acts as a safety layer, validating the outputs of other agents
    before they are presented to the user. It checks for compliance, safety, and
    hallucinations.
    """

    def __init__(self):
        # In a real implementation, this would load policy documents and safety rules.
        pass

    def validate_output(self, agent_name: str, output: Any) -> Dict[str, Any]:
        """
        Validates the output of a specific agent.
        """
        print(f"GovernanceAgent: Validating output from {agent_name}...")
        
        validation_result = {
            "is_safe": True,
            "warnings": [],
            "modifications": None
        }

        if agent_name == "AdviceAgent":
            validation_result = self._validate_advice(output)
        elif agent_name == "TaxAgent":
            validation_result = self._validate_tax(output)
        
        # Log the validation attempt (audit trail)
        self._log_audit(agent_name, validation_result)
        
        return validation_result

    def _validate_advice(self, advice: str) -> Dict[str, Any]:
        """
        Checks financial advice for harmful or illegal suggestions.
        """
        # Safety check: Keyword filtering for illegal activities
        forbidden_terms = ["evade tax", "hide money", "illegal", "launder"]
        warnings = []
        for term in forbidden_terms:
            if term in advice.lower():
                warnings.append(f"Detected potentially unsafe term: {term}")
        
        return {
            "is_safe": len(warnings) == 0,
            "warnings": warnings,
            "modifications": None
        }

    def _validate_tax(self, tax_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Sanity checks on tax computations.
        """
        # Check: Tax liability cannot be negative (unless it's a refund)
        warnings = []
        if tax_data.get("total_liability", 0) < 0:
             warnings.append("Negative tax liability detected. Please verify if this is a refund.")

        return {
            "is_safe": True, # We flag it but don't block it necessarily unless critical
            "warnings": warnings,
            "modifications": None
        }

    def _log_audit(self, agent_name: str, result: Dict[str, Any]):
        """
        Logs the validation event for auditing purposes.
        """
        # In production, write to a secure log file or database
        print(f"AUDIT LOG: [{agent_name}] Safe: {result['is_safe']}, Warnings: {result['warnings']}")

