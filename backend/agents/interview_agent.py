"""InterviewAgent — Generates role-specific interview questions and evaluates answers."""
from typing import List, Dict

QUESTION_BANK = {
    "python": [
        "What are Python decorators and give a real-world use case?",
        "Explain the difference between list and tuple.",
        "How does Python's GIL affect multithreading?"
    ],
    "machine learning": [
        "Explain overfitting and how to prevent it.",
        "What is the bias-variance tradeoff?",
        "When would you use Random Forest over Logistic Regression?"
    ],
    "sql": [
        "What is the difference between INNER JOIN and LEFT JOIN?",
        "How do you optimize a slow SQL query?",
        "Explain window functions with an example."
    ],
    "system design": [
        "Design a URL shortener like bit.ly.",
        "How would you design a job portal with millions of users?",
        "Explain how you'd design a notification system."
    ]
}

class InterviewAgent:
    def generate_questions(self, skills: List[str], count: int = 5) -> List[Dict]:
        questions = []
        for skill in skills:
            skill_lower = skill.lower()
            if skill_lower in QUESTION_BANK:
                for q in QUESTION_BANK[skill_lower][:2]:
                    questions.append({"skill": skill, "question": q})
        return questions[:count]

    def evaluate_answer(self, question: str, answer: str) -> Dict:
        word_count = len(answer.split())
        score = min(100, word_count * 2)
        return {
            "question": question,
            "score": score,
            "feedback": "Good" if score > 60 else "Needs more detail"
        }

interview_agent = InterviewAgent()
