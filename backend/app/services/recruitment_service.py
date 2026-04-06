from sqlalchemy.orm import Session
from app.models.recruitment import JobPosting, Candidate


def create_job(db: Session, data):
    job = JobPosting(**data.dict())
    db.add(job); db.commit(); db.refresh(job)
    return job

def get_all_jobs(db: Session):
    return db.query(JobPosting).all()

def get_job(db: Session, job_id: int):
    return db.query(JobPosting).filter(JobPosting.id == job_id).first()

def close_job(db: Session, job_id: int):
    job = get_job(db, job_id)
    if job:
        job.status = "closed"; db.commit(); db.refresh(job)
    return job

def add_candidate(db: Session, data):
    c = Candidate(**data.dict())
    db.add(c); db.commit(); db.refresh(c)
    return c

def get_candidates(db: Session, job_id: int):
    return db.query(Candidate).filter(Candidate.job_id == job_id).all()

def get_candidate(db: Session, candidate_id: int):
    return db.query(Candidate).filter(Candidate.id == candidate_id).first()

def update_stage(db: Session, candidate_id: int, stage: str):
    c = get_candidate(db, candidate_id)
    if c:
        c.stage = stage; db.commit(); db.refresh(c)
    return c

def save_ai_results(db: Session, candidate_id: int, score, reasoning, strengths, gaps, questions):
    c = get_candidate(db, candidate_id)
    if c:
        c.ai_score     = score
        c.ai_reasoning = reasoning
        c.ai_strengths = strengths
        c.ai_gaps      = gaps
        c.ai_questions = questions
        db.commit(); db.refresh(c)
    return c