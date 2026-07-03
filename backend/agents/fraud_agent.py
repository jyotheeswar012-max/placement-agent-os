"""FraudAgent — Detects fake/suspicious job postings using rule-based + ML scoring."""
from typing import Dict

SUSPICIOUS_KEYWORDS = [
    "urgent hiring", "earn from home", "no experience needed",
    "guaranteed salary", "work from anywhere", "$5000 per week",
    "click here to apply", "whatsapp us", "no interview"
]

class FraudAgent:
    def score_job(self, job_description: str, company: str, salary_max: float = None) -> Dict:
        text = job_description.lower()
        flags = [kw for kw in SUSPICIOUS_KEYWORDS if kw in text]
        flag_score = len(flags) * 15
        salary_flag = 0
        if salary_max and salary_max > 5000000:  # 50 LPA seems unrealistic for entry level
            salary_flag = 20
        total_score = min(100, flag_score + salary_flag)
        return {
            "is_suspicious": total_score > 40,
            "fraud_score": total_score,
            "flags": flags,
            "verdict": "FAKE" if total_score > 60 else ("SUSPICIOUS" if total_score > 30 else "GENUINE")
        }

fraud_agent = FraudAgent()
