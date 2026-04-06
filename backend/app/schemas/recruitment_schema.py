from pydantic import BaseModel
from typing import Optional

class JobCreate(BaseModel):
    title:          str
    department:     Optional[str] = None
    description:    Optional[str] = None
    required_skills:Optional[str] = None
    experience:     Optional[str] = None

class JobResponse(JobCreate):
    id:     int
    status: str
    class Config:
        from_attributes = True

class CandidateCreate(BaseModel):
    job_id:      int
    name:        str
    email:       Optional[str] = None
    resume_text: Optional[str] = None

class CandidateStageUpdate(BaseModel):
    stage: str

class CandidateResponse(BaseModel):
    id:           int
    job_id:       int
    name:         str
    email:        Optional[str]  = None
    resume_text:  Optional[str]  = None
    stage:        str
    ai_score:     Optional[float]= None
    ai_reasoning: Optional[str]  = None
    ai_strengths: Optional[str]  = None
    ai_gaps:      Optional[str]  = None
    ai_questions: Optional[str]  = None
    class Config:
        from_attributes = True