import os, json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL  = "llama-3.3-70b-versatile"

def _call(system: str, prompt: str, max_tokens: int = 200) -> str:
    try:
        r = client.chat.completions.create(
            model=MODEL,
            messages=[{"role":"system","content":system},{"role":"user","content":prompt}],
            temperature=0.7, max_tokens=max_tokens
        )
        return r.choices[0].message.content.strip()
    except Exception as e:
        print("AI ERROR:", e); return None

# ── EMPLOYEE ─────────────────────────────────────────────────
def generate_employee_bio(employee):
    p = f"Write a short professional employee bio.\nName: {employee.name}, Dept: {employee.department}, Role: {employee.designation}\nTone: Confident, modern. 3-4 lines. Achievement-style language."
    return _call("You are a professional HR assistant.", p, 150) or "Failed to generate bio"

def generate_skills(employee):
    p = f"Suggest exactly 5 skills for Role: {employee.designation}, Dept: {employee.department}\nReturn bullet points only."
    return _call("You are a professional HR assistant.", p, 120) or "Failed"

def generate_review(employee):
    p = f"Write a concise performance review for {employee.name}, {employee.designation}.\nStructure: Strengths, Areas to improve, Summary. Under 150 words."
    return _call("You are a professional HR assistant.", p, 250) or "Failed"

def detect_profile_issues(employee):
    issues = []
    if not employee.contact:      issues.append("Missing contact number")
    if not employee.joining_date: issues.append("Missing joining date")
    if not employee.manager:      issues.append("No manager assigned")
    if not employee.bio:          issues.append("Bio not generated yet")
    return issues

def generate_analytics_summary(analytics: dict) -> str:
    p = f"Write a concise monthly HR summary (under 120 words) with highlights, risks, and 1-2 actions.\nTotal:{analytics['total']}, Active:{analytics['active']}, Inactive:{analytics['inactive']}({analytics['attrition']}%), Depts:{analytics['by_dept']}"
    return _call("You are a senior HR analytics assistant.", p, 200) or "Unable to generate."

# ── LEAVE ─────────────────────────────────────────────────────
def analyze_leave_pattern(employee_name: str, patterns: list, leaves: list) -> str:
    if not patterns: return "No unusual leave patterns detected."
    summary = ", ".join([f"{l.leave_type} on {l.start_date}" for l in leaves[-10:]])
    p = f"Employee: {employee_name}\nPatterns: {', '.join(patterns)}\nLeaves: {summary}\nWrite a brief HR note (2-3 lines) flagging patterns and suggesting check-in."
    return _call("You are an HR compliance assistant.", p, 150) or "Pattern detected but analysis failed."

# ── PERFORMANCE ───────────────────────────────────────────────
def generate_performance_ai(review) -> dict:
    ratings = {"Quality":review.quality,"Delivery":review.delivery,"Communication":review.communication,"Initiative":review.initiative,"Teamwork":review.teamwork}
    avg = sum(v for v in ratings.values() if v) / max(len([v for v in ratings.values() if v]),1)
    summary  = _call("You are a senior HR manager.", f"Write a balanced performance review summary.\nSelf-assessment: Achievements:{review.achievements}, Challenges:{review.challenges}, Goals:{review.goals}\nManager ratings:{ratings}, Notes:{review.manager_notes}, Avg:{avg:.1f}/5\nWrite 2-3 professional paragraphs.", 300) or ""
    mismatch = _call("You are an HR analyst.", f"Compare self-assessment vs manager review.\nAchievements:{review.achievements}\nRatings:{ratings}, Notes:{review.manager_notes}\nFlag mismatches professionally in 2-3 lines.", 150) or ""
    actions  = _call("You are an HR development coach.", f"Suggest 3 specific development actions.\nRatings:{ratings}, Challenges:{review.challenges}, Goals:{review.goals}\nReturn 3 bullet points only.", 150) or ""
    return {"summary":summary, "mismatch":mismatch, "actions":actions}

# ── RECRUITMENT ───────────────────────────────────────────────
def score_resume(job, candidate) -> dict:
    p = f"""You are an ATS system. Score this resume against the job description.

JOB:
Title: {job.title}
Department: {job.department}
Description: {job.description}
Required Skills: {job.required_skills}
Experience: {job.experience}

CANDIDATE RESUME:
{candidate.resume_text}

Return ONLY valid JSON (no extra text) with these exact keys:
{{
  "score": <number 0-100>,
  "reasoning": "<2-3 sentence explanation>",
  "strengths": "<top 3 strengths as bullet points>",
  "gaps": "<top 2 gaps as bullet points>"
}}"""
    raw = _call("You are an expert ATS resume scorer. Return only valid JSON.", p, 400)
    try:
        raw = raw.strip()
        if raw.startswith("```"): raw = raw.split("```")[1].lstrip("json").strip()
        return json.loads(raw)
    except:
        return {"score":50,"reasoning":"Could not parse AI response.","strengths":"N/A","gaps":"N/A"}

def generate_interview_questions(job, candidate) -> str:
    p = f"""Generate exactly 5 tailored interview questions for:

Role: {job.title}
Required Skills: {job.required_skills}
Candidate: {candidate.name}
Resume summary: {(candidate.resume_text or '')[:500]}

Return only 5 numbered questions. Be specific and role-relevant."""
    return _call("You are a senior technical interviewer.", p, 300) or "Failed to generate questions."

# ── ONBOARDING CHATBOT ────────────────────────────────────────
def answer_from_docs(question: str, documents: list) -> str:
    if not documents:
        return "No policy documents uploaded yet. Please contact HR."

    context = "\n\n---\n\n".join([f"[{d.title}]\n{d.content}" for d in documents[:8]])

    p = f"""You are an onboarding assistant for new employees.
Answer the question ONLY using the provided policy documents.
If the answer is not in the documents, say exactly: "I don't have that information. Please contact HR at hr@company.com"

POLICY DOCUMENTS:
{context}

QUESTION: {question}

Answer clearly and concisely."""
    return _call("You are a helpful onboarding assistant. Only use provided documents to answer.", p, 300) or "Unable to answer. Please contact HR."