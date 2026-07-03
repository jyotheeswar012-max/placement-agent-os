"""ResumeAgent — Parses resume PDF/DOCX, extracts skills, scores the resume."""
import re
from typing import List, Dict

class ResumeAgent:
    def __init__(self):
        self.skill_keywords = [
            "python", "java", "javascript", "react", "fastapi", "django",
            "sql", "postgresql", "mongodb", "docker", "aws", "machine learning",
            "deep learning", "nlp", "pandas", "numpy", "scikit-learn", "git"
        ]

    def extract_skills(self, text: str) -> List[str]:
        text_lower = text.lower()
        found = [skill for skill in self.skill_keywords if skill in text_lower]
        return list(set(found))

    def score_resume(self, text: str) -> Dict:
        skills = self.extract_skills(text)
        score = min(100, len(skills) * 5 + 30)
        return {
            "score": score,
            "extracted_skills": skills,
            "feedback": self._generate_feedback(score)
        }

    def _generate_feedback(self, score: float) -> str:
        if score >= 80:
            return "Strong resume. Highlight quantified achievements."
        elif score >= 60:
            return "Good resume. Add more technical skills and projects."
        else:
            return "Needs improvement. Add skills, projects and certifications."

    def parse_contact(self, text: str) -> Dict:
        email = re.findall(r'[\w.-]+@[\w.-]+\.\w+', text)
        phone = re.findall(r'[+]?\d[\d\s-]{9,}', text)
        return {
            "email": email[0] if email else None,
            "phone": phone[0] if phone else None
        }

resume_agent = ResumeAgent()
