from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class StudentProfile(BaseModel):
    name: str
    email: str
    university: str
    department: str
    cgpa: float
    skills: List[str] = []
    graduation_year: int

@router.get("/profile/{student_id}")
def get_profile(student_id: int):
    return {"student_id": student_id, "message": "Profile fetched"}

@router.put("/profile/{student_id}")
def update_profile(student_id: int, profile: StudentProfile):
    return {"message": "Profile updated", "data": profile}

@router.post("/upload-resume/{student_id}")
async def upload_resume(student_id: int, file: UploadFile = File(...)):
    contents = await file.read()
    return {
        "message": "Resume uploaded",
        "filename": file.filename,
        "size": len(contents)
    }

@router.get("/skill-gap/{student_id}")
def get_skill_gap(student_id: int, job_id: Optional[int] = None):
    return {
        "student_id": student_id,
        "missing_skills": ["Docker", "GraphQL", "AWS"],
        "recommended_courses": [
            {"skill": "Docker", "course": "Docker Mastery - Udemy"},
            {"skill": "AWS", "course": "AWS Cloud Practitioner - AWS Training"}
        ]
    }
