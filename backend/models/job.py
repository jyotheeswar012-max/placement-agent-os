from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    company = Column(String(150), nullable=False)
    description = Column(Text)
    required_skills = Column(JSON, default=[])
    location = Column(String(100))
    salary_min = Column(Float)
    salary_max = Column(Float)
    job_type = Column(String(50))  # Full-time, Internship, Part-time
    experience_required = Column(String(50))
    deadline = Column(DateTime)
    is_verified = Column(Boolean, default=False)
    is_fake = Column(Boolean, default=False)
    fake_score = Column(Float, default=0.0)
    source_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
