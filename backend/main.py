from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import auth, students, jobs, applications, analytics
from backend.config import settings

app = FastAPI(
    title="Placement Agent OS",
    description="AI-powered career navigation & job matching platform for students",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(students.router, prefix="/api/students", tags=["Students"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
def root():
    return {"message": "Placement Agent OS API", "version": "1.0.0", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}
