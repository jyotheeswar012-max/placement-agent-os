"""Skill Extractor — Extracts skills from raw text using keyword matching + NLP patterns."""
from typing import List

SKILL_TAXONOMY = {
    "programming": ["python", "java", "c++", "javascript", "typescript", "go", "rust", "r"],
    "web": ["react", "vue", "angular", "node.js", "django", "fastapi", "flask", "express"],
    "data": ["pandas", "numpy", "matplotlib", "seaborn", "plotly", "tableau", "power bi"],
    "ml": ["scikit-learn", "tensorflow", "pytorch", "keras", "xgboost", "huggingface"],
    "cloud": ["aws", "gcp", "azure", "docker", "kubernetes", "terraform"],
    "database": ["sql", "postgresql", "mongodb", "redis", "elasticsearch", "mysql"],
    "tools": ["git", "github", "linux", "jira", "postman", "swagger"]
}

class SkillExtractor:
    def __init__(self):
        self.all_skills = {
            skill: category
            for category, skills in SKILL_TAXONOMY.items()
            for skill in skills
        }

    def extract(self, text: str) -> List[dict]:
        text_lower = text.lower()
        found = []
        for skill, category in self.all_skills.items():
            if skill in text_lower:
                found.append({"skill": skill, "category": category})
        return found

    def extract_flat(self, text: str) -> List[str]:
        return [item["skill"] for item in self.extract(text)]

skill_extractor = SkillExtractor()
