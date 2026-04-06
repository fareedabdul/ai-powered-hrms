# 🤖 AI-Powered HRMS — Human Resource Management System

A fully functional, AI-integrated HR Management System built with FastAPI, React, PostgreSQL, and Groq (Llama 3.3 70B).

---

## 🚀 Project Overview

Most HR systems are just databases with forms. This HRMS weaves AI into every core HR workflow — from generating employee bios to scoring resumes, detecting leave patterns, and running performance reviews — making HR tasks faster, smarter, and less manual.

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js, Custom CSS Design System |
| Backend   | FastAPI (Python)                  |
| Database  | PostgreSQL (hosted on Render)     |
| AI / LLM  | Groq API — Llama 3.3 70B          |
| Hosting   | Render (backend), Vercel (frontend) |

---

## ✨ Features

### Module 1 — Employee Records
- Add, edit, delete, deactivate employees
- Search by name, role, or department
- Filter by department and status (active/inactive)
- Export employee list as CSV
- AI: Auto-generate professional bio, suggest skills, detect incomplete profiles

### Module 2 — Recruitment ATS
- Create job postings with JD and required skills
- Add candidates with resume text
- Move candidates through pipeline: Applied → Screening → Interview → Offer → Hired/Rejected
- AI: Score resume against JD (0-100%), highlight strengths & gaps, generate 5 tailored interview questions

### Module 3 — Leave & Attendance
- Apply for leave (Sick, Casual, Earned, WFH)
- Manager approves or rejects with comments
- Leave balance tracker per employee per type
- Mark daily attendance (Present, Absent, WFH, Half Day)
- AI: Detect unusual leave patterns (repeated Mondays/Fridays)

### Module 4 — Performance Reviews
- Employee self-assessment (achievements, challenges, goals)
- Manager ratings on 5 parameters (Quality, Delivery, Communication, Initiative, Teamwork)
- AI: Generate balanced review summary, detect self vs manager rating mismatches, suggest 3 development actions

### Module 5 — Onboarding Assistant
- AI chatbot that answers questions from uploaded policy documents only (no hallucination)
- Role-based onboarding checklist with progress tracking
- Upload policy documents (leave policy, tools guide, code of conduct)

### Module 6 — HR Analytics
- Headcount by department (bar chart)
- Active vs inactive employees
- Attrition rate
- Bios generated count
- AI: Generate monthly HR summary with highlights, risks, and recommended actions

### UX Features
- Dark / Light mode toggle (saved to localStorage)
- Toast notifications (success, error, info)
- Loading spinners on all async actions
- Responsive design (mobile friendly)
- Animated employee cards

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL database (or use Render free tier)
- Groq API key (free at console.groq.com)

---

### Backend Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/hrms-ai.git
cd hrms-ai/backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac/Linux

# 3. Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary groq python-dotenv

# 4. Create .env file
DATABASE_URL=postgresql://user:password@host/dbname
GROQ_API_KEY=your_groq_api_key_here

# 5. Run the server
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

### Frontend Setup

```bash
cd hrms-ai/frontend/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 📁 Project Structure

```
hrms-ai/
├── backend/
│   └── app/
│       ├── models/          # SQLAlchemy models
│       │   ├── employee.py
│       │   ├── leave.py
│       │   ├── attendance.py
│       │   ├── performance.py
│       │   ├── recruitment.py
│       │   └── onboarding.py
│       ├── schemas/         # Pydantic schemas
│       ├── services/        # Business logic + AI
│       │   ├── ai_service.py
│       │   ├── employee_service.py
│       │   ├── leave_service.py
│       │   ├── performance_service.py
│       │   ├── recruitment_service.py
│       │   └── onboarding_service.py
│       ├── routes/          # FastAPI routers
│       ├── database/        # DB connection
│       └── main.py
└── frontend/
    └── frontend/
        └── src/
            ├── components/  # React components
            ├── services/    # API calls
            ├── hooks/       # Custom hooks
            ├── App.jsx
            └── App.css
```

---

## 🔑 Environment Variables

```env
DATABASE_URL=postgresql://user:password@host/dbname
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

---

## ⚠️ Known Limitations

1. **Resume upload is text-only** — candidates paste resume text instead of uploading a PDF. With more time, I'd integrate PDF parsing using PyMuPDF or pdfplumber.

2. **Onboarding chatbot has no memory** — each question is answered independently without conversation history. I'd add a message history array passed to the LLM.

3. **No authentication** — there's no login system or role-based access (HR admin vs employee vs manager). I'd add JWT-based auth with FastAPI-Users.

4. **Leave calendar view missing** — team calendar showing who is out when wasn't implemented. I'd use FullCalendar.js for this.

5. **No email notifications** — approvals and rejections don't send emails. I'd integrate SendGrid or SMTP for this.

---

## 🤖 AI Prompt Design Decisions

The most important prompt decision was for the **onboarding chatbot**. I explicitly instructed the model to answer ONLY from the provided documents and give a specific fallback message if it doesn't know:

```
"If the answer is not in the documents, say exactly:
I don't have that information. Please contact HR at hr@company.com"
```

This prevents hallucination — a critical requirement for HR policy Q&A.

---

## 👨‍💻 Author

**Abdul Fareed**
Built for the AI-Powered HRMS Assignment