from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ApplicationRequest(BaseModel):
    student_id: int
    job_id: int

@router.post("/apply")
def apply(req: ApplicationRequest):
    return {
        "message": "Application submitted",
        "student_id": req.student_id,
        "job_id": req.job_id,
        "status": "applied"
    }

@router.get("/student/{student_id}")
def get_applications(student_id: int):
    return {
        "student_id": student_id,
        "applications": [],
        "stats": {
            "total": 0,
            "shortlisted": 0,
            "rejected": 0,
            "hired": 0
        }
    }

@router.put("/status/{application_id}")
def update_status(application_id: int, status: str):
    return {
        "application_id": application_id,
        "status": status,
        "message": "Status updated"
    }
