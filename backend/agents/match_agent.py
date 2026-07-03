"""MatchAgent — Computes job-student match score using cosine similarity on skill vectors."""
from typing import List, Dict
import numpy as np

class MatchAgent:
    def __init__(self):
        self.all_skills = [
            "python", "java", "javascript", "react", "fastapi", "django",
            "sql", "postgresql", "mongodb", "docker", "aws", "machine learning",
            "deep learning", "nlp", "pandas", "numpy", "scikit-learn", "git",
            "node.js", "typescript", "kubernetes", "graphql", "redis"
        ]

    def _vectorize(self, skills: List[str]) -> np.ndarray:
        skills_lower = [s.lower() for s in skills]
        return np.array([1 if s in skills_lower else 0 for s in self.all_skills])

    def match_score(self, student_skills: List[str], job_skills: List[str]) -> float:
        vec_student = self._vectorize(student_skills)
        vec_job = self._vectorize(job_skills)
        if np.linalg.norm(vec_student) == 0 or np.linalg.norm(vec_job) == 0:
            return 0.0
        cos_sim = np.dot(vec_student, vec_job) / (
            np.linalg.norm(vec_student) * np.linalg.norm(vec_job)
        )
        return round(float(cos_sim) * 100, 2)

    def skill_gap(self, student_skills: List[str], job_skills: List[str]) -> List[str]:
        student_lower = [s.lower() for s in student_skills]
        return [s for s in job_skills if s.lower() not in student_lower]

    def rank_jobs(self, student_skills: List[str], jobs: List[Dict]) -> List[Dict]:
        for job in jobs:
            job["match_score"] = self.match_score(student_skills, job.get("required_skills", []))
        return sorted(jobs, key=lambda x: x["match_score"], reverse=True)

match_agent = MatchAgent()
