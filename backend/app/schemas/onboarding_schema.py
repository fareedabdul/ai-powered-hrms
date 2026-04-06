from pydantic import BaseModel
from typing import Optional

class ChecklistCreate(BaseModel):
    role:        str
    title:       str
    description: Optional[str] = None
    due_days:    Optional[int] = 7
    assignee:    Optional[str] = None

class ChecklistResponse(ChecklistCreate):
    id: int
    class Config:
        from_attributes = True

class ProgressUpdate(BaseModel):
    employee_id:  int
    checklist_id: int
    completed:    bool

class ProgressResponse(ProgressUpdate):
    id: int
    class Config:
        from_attributes = True

class PolicyCreate(BaseModel):
    title:    str
    content:  str
    category: Optional[str] = "general"

class PolicyResponse(PolicyCreate):
    id: int
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    question: str