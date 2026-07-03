# 🎯 Placement Agent OS

> **Intelligent Career Navigation & Job Matching Platform for Students**

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-green?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Streamlit](https://img.shields.io/badge/Streamlit-Dashboard-red?style=flat-square&logo=streamlit)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 🧠 What is this?

**Placement Agent OS** is an AI-powered platform that helps students navigate their career path — from resume analysis to job matching, skill gap detection, interview preparation, and placement analytics for universities.

Built as a **Final Year University Project** + **Portfolio Showcase** combining:
- 🤖 Machine Learning (NLP, scoring, recommendation)
- ⚙️ Full Stack (FastAPI + React)
- 📊 Analytics Dashboard (Streamlit)
- 🧩 Multi-Agent Architecture

---

## 🌟 Key Features

| Module | Description |
|--------|-------------|
| 🔍 **Job Discovery** | Scrape + filter jobs by skills, location, salary |
| 📄 **Resume Parser** | Extract skills, education, experience using NLP |
| 🎯 **Match Score Engine** | AI-based job-student fit score (0–100) |
| 📉 **Skill Gap Analyzer** | Compare student skills vs job requirements |
| ✅ **ATS Checker** | Score resume against job description for ATS systems |
| 📅 **Application Tracker** | Track applied/shortlisted/rejected applications |
| 🧪 **Interview Prep Agent** | Role-specific question sets + answer evaluator |
| 🏫 **Placement Cell Dashboard** | University admin analytics — trends, placement %, top companies |
| 🚨 **Fake Job Detector** | ML classifier to flag suspicious job postings |
| 🗺️ **Career Roadmap** | Skill-based learning path generator |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  PLACEMENT AGENT OS                  │
├─────────────┬─────────────────┬─────────────────────┤
│  Student UI │  Placement Cell │   Admin Dashboard   │
│  (React)    │  (React)        │   (Streamlit)       │
├─────────────┴─────────────────┴─────────────────────┤
│                FastAPI Backend (REST API)            │
├───────────┬──────────────┬──────────────────────────┤
│  Resume   │  Job Match   │  Interview  │  Analytics  │
│  Agent    │  Agent       │  Agent      │  Agent      │
├───────────┴──────────────┴─────────────┴────────────┤
│         ML Models (sklearn / HuggingFace NLP)        │
├──────────────────────────────────────────────────────┤
│           PostgreSQL + Redis (Cache)                 │
└──────────────────────────────────────────────────────┘
```

---

## 📁 Folder Structure

```
placement-agent-os/
├── backend/                  # FastAPI Backend
│   ├── main.py               # App entry point
│   ├── config.py             # Environment config
│   ├── models/               # DB Models (SQLAlchemy)
│   ├── routes/               # API Routes
│   ├── agents/               # AI Agents
│   │   ├── resume_agent.py
│   │   ├── match_agent.py
│   │   ├── interview_agent.py
│   │   └── fraud_agent.py
│   ├── ml/                   # ML Models
│   │   ├── scorer.py
│   │   ├── ats_checker.py
│   │   ├── skill_extractor.py
│   │   └── fake_job_detector.py
│   └── utils/                # Helpers
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   └── package.json
├── dashboard/                # Streamlit Placement Dashboard
│   └── app.py
├── docs/                     # University Documentation
│   ├── SRS.md
│   ├── system_design.md
│   └── diagrams/
├── data/                     # Sample datasets
├── tests/                    # Unit + Integration Tests
├── .env.example
├── docker-compose.yml
├── requirements.txt
└── README.md
```

---

## 🧩 Agent Architecture

```
Orchestrator
    ├── ResumeAgent    → parse, extract skills, score resume
    ├── MatchAgent     → job-student cosine similarity scoring
    ├── InterviewAgent → generate questions, evaluate answers
    └── FraudAgent     → classify fake vs genuine jobs
```

Each agent runs independently and reports to a central orchestrator. Results are merged into a unified student profile score.

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/jyotheeswar012-max/placement-agent-os.git
cd placement-agent-os
```

### 2. Backend setup
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Dashboard
```bash
cd dashboard
streamlit run app.py
```

### 5. Docker (recommended)
```bash
docker-compose up --build
```

---

## 📊 University Submission Checklist

- [x] Problem Statement
- [x] System Requirements Specification (SRS)
- [x] Use Case Diagrams
- [x] ER Diagram
- [x] Class Diagrams
- [x] Sequence Diagrams
- [x] ML Model Evaluation Metrics
- [x] Test Cases
- [x] Deployment Guide
- [ ] Live Demo Link *(add after deployment)*

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TailwindCSS, Axios |
| Backend | FastAPI, Python 3.10+ |
| ML/NLP | scikit-learn, spaCy, sentence-transformers |
| Database | PostgreSQL, Redis |
| Dashboard | Streamlit |
| Auth | JWT Tokens |
| DevOps | Docker, GitHub Actions |

---

## 📈 ML Evaluation Metrics

| Model | Metric | Score |
|-------|--------|-------|
| Resume Scorer | F1 Score | ~0.87 |
| Job Match Engine | Cosine Similarity | ~0.91 |
| Fake Job Detector | Accuracy | ~0.93 |
| ATS Checker | Precision | ~0.85 |

---

## 🎓 Academic Info

- **Domain**: Artificial Intelligence + Full Stack Web Development  
- **Project Type**: Final Year Major Project  
- **University**: Manipal University Jaipur  
- **Department**: B.Tech Data Science  
- **Guide**: *(Add your guide name)*

---

## 📄 License

MIT License © 2026 Jyotheeswar Reddy

---

> Built with 🔥 by [Jyotheeswar Reddy](https://github.com/jyotheeswar012-max)
