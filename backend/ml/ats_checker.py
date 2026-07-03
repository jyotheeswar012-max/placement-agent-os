"""ATS Checker — Scores a resume against a job description for Applicant Tracking Systems."""
from typing import List, Dict
import re

class ATSChecker:
    def extract_keywords(self, text: str) -> List[str]:
        words = re.findall(r'\b[a-zA-Z][a-zA-Z+#.]{2,}\b', text.lower())
        stopwords = {"the", "and", "for", "are", "with", "you", "will", "have",
                     "this", "that", "from", "they", "your", "our", "not"}
        return list(set([w for w in words if w not in stopwords]))

    def score(self, resume_text: str, job_description: str) -> Dict:
        resume_kws = set(self.extract_keywords(resume_text))
        job_kws = set(self.extract_keywords(job_description))
        matched = resume_kws & job_kws
        missing = job_kws - resume_kws
        score = round(len(matched) / max(len(job_kws), 1) * 100, 2)
        return {
            "ats_score": score,
            "matched_keywords": list(matched),
            "missing_keywords": list(missing)[:10],
            "recommendation": "Good ATS match" if score > 70 else "Add more job-specific keywords"
        }

ats_checker = ATSChecker()
