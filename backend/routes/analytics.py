from fastapi import APIRouter

router = APIRouter()

@router.get("/placement-stats")
def placement_stats(university: str = None, year: int = None):
    return {
        "placement_percentage": 78.5,
        "avg_package": 650000,
        "highest_package": 1800000,
        "top_recruiters": ["TCS", "Infosys", "Google", "Amazon", "Wipro"],
        "department_wise": [
            {"dept": "CSE", "placed": 92, "total": 100},
            {"dept": "Data Science", "placed": 85, "total": 90},
            {"dept": "ECE", "placed": 70, "total": 80}
        ]
    }

@router.get("/skill-trends")
def skill_trends():
    return {
        "trending_skills": [
            {"skill": "Python", "demand_score": 98},
            {"skill": "Machine Learning", "demand_score": 95},
            {"skill": "React", "demand_score": 90},
            {"skill": "AWS", "demand_score": 88},
            {"skill": "Docker", "demand_score": 85}
        ]
    }

@router.get("/interview-readiness/{student_id}")
def interview_readiness(student_id: int):
    return {
        "student_id": student_id,
        "readiness_score": 72.0,
        "strong_areas": ["Python", "SQL", "ML Basics"],
        "weak_areas": ["System Design", "DSA"],
        "recommended_prep": "Focus on LeetCode Medium + System Design Primer"
    }
