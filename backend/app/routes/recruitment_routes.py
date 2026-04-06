from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.recruitment_schema import JobCreate, JobResponse, CandidateCreate, CandidateStageUpdate, CandidateResponse
from app.services import recruitment_service, ai_service

router = APIRouter()

@router.post("/jobs", response_model=JobResponse)
def create_job(data: JobCreate, db: Session = Depends(get_db)):
    return recruitment_service.create_job(db, data)

@router.get("/jobs", response_model=list[JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    return recruitment_service.get_all_jobs(db)

@router.patch("/jobs/{job_id}/close", response_model=JobResponse)
def close_job(job_id: int, db: Session = Depends(get_db)):
    job = recruitment_service.close_job(db, job_id)
    if not job: raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.post("/candidates", response_model=CandidateResponse)
def add_candidate(data: CandidateCreate, db: Session = Depends(get_db)):
    return recruitment_service.add_candidate(db, data)

@router.get("/candidates/{job_id}", response_model=list[CandidateResponse])
def get_candidates(job_id: int, db: Session = Depends(get_db)):
    return recruitment_service.get_candidates(db, job_id)

@router.patch("/candidates/{candidate_id}/stage", response_model=CandidateResponse)
def update_stage(candidate_id: int, data: CandidateStageUpdate, db: Session = Depends(get_db)):
    c = recruitment_service.update_stage(db, candidate_id, data.stage)
    if not c: raise HTTPException(status_code=404, detail="Candidate not found")
    return c

@router.post("/candidates/{candidate_id}/score", response_model=CandidateResponse)
def score_candidate(candidate_id: int, db: Session = Depends(get_db)):
    c   = recruitment_service.get_candidate(db, candidate_id)
    if not c: raise HTTPException(status_code=404, detail="Candidate not found")
    job = recruitment_service.get_job(db, c.job_id)
    result = ai_service.score_resume(job, c)
    return recruitment_service.save_ai_results(db, candidate_id, result.get("score"), result.get("reasoning"), result.get("strengths"), result.get("gaps"), None)

@router.post("/candidates/{candidate_id}/questions", response_model=CandidateResponse)
def generate_questions(candidate_id: int, db: Session = Depends(get_db)):
    c   = recruitment_service.get_candidate(db, candidate_id)
    if not c: raise HTTPException(status_code=404, detail="Candidate not found")
    job = recruitment_service.get_job(db, c.job_id)
    questions = ai_service.generate_interview_questions(job, c)
    return recruitment_service.save_ai_results(db, candidate_id, c.ai_score, c.ai_reasoning, c.ai_strengths, c.ai_gaps, questions)