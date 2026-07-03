from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    university = Column(String(150))
    department = Column(String(100))
    graduation_year = Column(Integer)
    cgpa = Column(Float)
    resume_url = Column(String(500))
    skills = Column(JSON, default=[])
    profile_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
