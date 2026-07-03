import pytest
from backend.agents.resume_agent import ResumeAgent
from backend.agents.match_agent import MatchAgent
from backend.agents.fraud_agent import FraudAgent
from backend.ml.ats_checker import ATSChecker

# --- ResumeAgent Tests ---
def test_resume_skill_extraction():
    agent = ResumeAgent()
    text = "Experienced in Python, Machine Learning, and SQL."
    skills = agent.extract_skills(text)
    assert "python" in skills
    assert "machine learning" in skills
    assert "sql" in skills

def test_resume_score_not_zero():
    agent = ResumeAgent()
    text = "Python developer with 2 years experience in Django, SQL, and AWS."
    result = agent.score_resume(text)
    assert result["score"] > 0

# --- MatchAgent Tests ---
def test_match_score_high_overlap():
    agent = MatchAgent()
    student_skills = ["python", "sql", "machine learning"]
    job_skills = ["python", "sql", "machine learning", "pandas"]
    score = agent.match_score(student_skills, job_skills)
    assert score > 70

def test_skill_gap():
    agent = MatchAgent()
    student_skills = ["python", "sql"]
    job_skills = ["python", "sql", "docker", "aws"]
    gap = agent.skill_gap(student_skills, job_skills)
    assert "docker" in gap
    assert "aws" in gap

# --- FraudAgent Tests ---
def test_fake_job_detection():
    agent = FraudAgent()
    fake_desc = "urgent hiring, earn from home, no experience needed, guaranteed salary"
    result = agent.score_job(fake_desc, "Unknown Company")
    assert result["is_suspicious"] == True

def test_genuine_job_passes():
    agent = FraudAgent()
    genuine_desc = "We are looking for a Python developer with 2+ years experience in FastAPI and PostgreSQL."
    result = agent.score_job(genuine_desc, "TechCorp")
    assert result["verdict"] == "GENUINE"

# --- ATS Checker Tests ---
def test_ats_score_basic():
    checker = ATSChecker()
    resume = "Experienced Python developer skilled in machine learning, SQL, and data analysis."
    jd = "Looking for Python developer with machine learning and SQL skills."
    result = checker.score(resume, jd)
    assert result["ats_score"] > 50
