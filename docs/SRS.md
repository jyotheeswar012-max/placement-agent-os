# Software Requirements Specification (SRS)
## Placement Agent OS

**Version**: 1.0  
**Date**: July 2026  
**Author**: Jyotheeswar Reddy  
**Institution**: Manipal University Jaipur  

---

## 1. Introduction

### 1.1 Purpose
This document specifies the requirements for Placement Agent OS — an AI-powered career navigation and job matching platform for university students.

### 1.2 Scope
The system targets final year students, placement coordinators, and company recruiters. It automates resume analysis, job matching, skill gap detection, and interview preparation.

### 1.3 Definitions
- **ATS**: Applicant Tracking System
- **Match Score**: AI-generated percentage showing how well a student fits a job
- **Skill Gap**: Skills required by a job but missing from the student profile

---

## 2. Overall Description

### 2.1 Product Perspective
A web-based full-stack platform with a FastAPI backend, React frontend, ML matching engine, and Streamlit analytics dashboard.

### 2.2 Product Features
- Student profile and resume management
- Job discovery and smart filtering
- AI-powered job-student matching (0–100 score)
- ATS resume checker
- Skill gap analyzer with learning roadmap
- Application tracking
- Interview preparation agent
- Placement cell analytics dashboard
- Fake job detector

### 2.3 User Classes
| User | Description |
|------|-------------|
| Student | Registers, uploads resume, applies to jobs |
| Placement Coordinator | Manages companies, tracks placements |
| Company Recruiter | Posts jobs, reviews applications |
| System Admin | Manages users, verifies companies |

---

## 3. Functional Requirements

### FR-01: Student Registration
- Students shall register with email, university, and department.
- System shall hash passwords using bcrypt.

### FR-02: Resume Upload
- Students shall upload PDF or DOCX resumes.
- System shall extract skills, education, and experience using NLP.

### FR-03: Job Matching
- System shall compute match scores using cosine similarity on skill vectors.
- System shall rank jobs by match score for each student.

### FR-04: ATS Check
- System shall compare resume keywords against job description keywords.
- System shall return ATS score and list of missing keywords.

### FR-05: Application Tracker
- Students shall track application status: Applied, Shortlisted, Rejected, Hired.

### FR-06: Interview Prep
- System shall generate role-specific interview questions based on student skills.

### FR-07: Placement Analytics
- Placement coordinators shall access year-wise placement rates, package trends, and top recruiters.

### FR-08: Fake Job Detection
- System shall flag suspicious job postings using keyword rules and ML scoring.

---

## 4. Non-Functional Requirements

- **Performance**: API response time < 300ms for matching
- **Scalability**: Support 10,000+ concurrent users
- **Security**: JWT authentication, bcrypt password hashing, HTTPS
- **Availability**: 99.9% uptime SLA
- **Usability**: Mobile-responsive UI

---

## 5. System Constraints
- Deployed on cloud (Render / Railway / AWS EC2)
- PostgreSQL as primary database
- ML models served via FastAPI endpoints
