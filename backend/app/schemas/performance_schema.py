from pydantic import BaseModel
from typing import Optional

class ReviewCreate(BaseModel):
    employee_id:   int
    period:        str
    achievements:  Optional[str] = None
    challenges:    Optional[str] = None
    goals:         Optional[str] = None

class ReviewManagerUpdate(BaseModel):
    quality:       Optional[float] = None
    delivery:      Optional[float] = None
    communication: Optional[float] = None
    initiative:    Optional[float] = None
    teamwork:      Optional[float] = None
    manager_notes: Optional[str]   = None

class ReviewResponse(BaseModel):
    id:            int
    employee_id:   int
    period:        str
    achievements:  Optional[str]   = None
    challenges:    Optional[str]   = None
    goals:         Optional[str]   = None
    quality:       Optional[float] = None
    delivery:      Optional[float] = None
    communication: Optional[float] = None
    initiative:    Optional[float] = None
    teamwork:      Optional[float] = None
    manager_notes: Optional[str]   = None
    ai_summary:    Optional[str]   = None
    ai_mismatch:   Optional[str]   = None
    ai_actions:    Optional[str]   = None
    status:        str

    class Config:
        from_attributes = True