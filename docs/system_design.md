# System Design Document
## Placement Agent OS

---

## 1. High-Level Architecture

```
[Student/Recruiter Browser]
         |
    [React Frontend]
         |
    [FastAPI Backend] ←→ [Redis Cache]
         |
    ┌────┴─────────────────────────────┐
    │                                  │
[Agent Orchestrator]            [PostgreSQL DB]
    |
    ├── ResumeAgent
    ├── MatchAgent
    ├── InterviewAgent
    └── FraudAgent
```

---

## 2. Database Schema

### students
| Column | Type | Description |
|--------|------|-------------|
| id | INT PK | Student ID |
| name | VARCHAR | Full name |
| email | VARCHAR | Login email |
| university | VARCHAR | University name |
| cgpa | FLOAT | CGPA |
| skills | JSON | List of skills |
| profile_score | FLOAT | AI-computed score |

### jobs
| Column | Type | Description |
|--------|------|-------------|
| id | INT PK | Job ID |
| title | VARCHAR | Job title |
| company | VARCHAR | Company name |
| required_skills | JSON | Required skills |
| is_fake | BOOL | Fraud flag |
| fake_score | FLOAT | Fraud confidence |

### applications
| Column | Type | Description |
|--------|------|-------------|
| id | INT PK | Application ID |
| student_id | FK | References students |
| job_id | FK | References jobs |
| match_score | FLOAT | AI match score |
| ats_score | FLOAT | ATS score |
| status | VARCHAR | applied/shortlisted/hired |

---

## 3. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register student |
| POST | /api/auth/login | Login |
| GET | /api/students/profile/{id} | Get profile |
| POST | /api/students/upload-resume/{id} | Upload resume |
| GET | /api/students/skill-gap/{id} | Get skill gaps |
| GET | /api/jobs/ | List all jobs |
| GET | /api/jobs/match/{student_id} | AI matched jobs |
| GET | /api/jobs/ats-check/{job_id} | ATS score |
| POST | /api/applications/apply | Apply to job |
| GET | /api/applications/student/{id} | My applications |
| GET | /api/analytics/placement-stats | University stats |
| GET | /api/analytics/skill-trends | Trending skills |

---

## 4. ML Pipeline

```
Resume PDF/DOCX
    ↓
Text Extraction (pdfplumber)
    ↓
Skill Extraction (keyword match + NLP)
    ↓
Skill Vector (binary, 23-dim)
    ↓
Cosine Similarity with Job Vector
    ↓
Match Score (0–100)
```

---

## 5. Agent Architecture

| Agent | Input | Output |
|-------|-------|--------|
| ResumeAgent | Raw text | Skills, score, feedback |
| MatchAgent | Student skills + Job skills | Match score, skill gap |
| InterviewAgent | Skills list | Questions + answer eval |
| FraudAgent | Job description | Fraud score + verdict |
