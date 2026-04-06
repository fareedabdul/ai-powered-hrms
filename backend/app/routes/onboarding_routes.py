from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.onboarding_schema import ChecklistCreate, ChecklistResponse, ProgressUpdate, ProgressResponse, PolicyCreate, PolicyResponse, ChatRequest
from app.services import onboarding_service, ai_service

router = APIRouter()

@router.post("/checklist", response_model=ChecklistResponse)
def create_item(data: ChecklistCreate, db: Session = Depends(get_db)):
    return onboarding_service.create_checklist_item(db, data)

@router.get("/checklist", response_model=list[ChecklistResponse])
def get_all(db: Session = Depends(get_db)):
    return onboarding_service.get_all_checklists(db)

@router.get("/checklist/{role}", response_model=list[ChecklistResponse])
def get_by_role(role: str, db: Session = Depends(get_db)):
    return onboarding_service.get_checklist_by_role(db, role)

@router.post("/progress", response_model=ProgressResponse)
def update_progress(data: ProgressUpdate, db: Session = Depends(get_db)):
    return onboarding_service.upsert_progress(db, data.employee_id, data.checklist_id, data.completed)

@router.get("/progress/{employee_id}", response_model=list[ProgressResponse])
def get_progress(employee_id: int, db: Session = Depends(get_db)):
    return onboarding_service.get_progress(db, employee_id)

@router.post("/documents", response_model=PolicyResponse)
def add_document(data: PolicyCreate, db: Session = Depends(get_db)):
    return onboarding_service.add_document(db, data)

@router.get("/documents", response_model=list[PolicyResponse])
def get_documents(db: Session = Depends(get_db)):
    return onboarding_service.get_all_documents(db)

@router.post("/chat")
def chat(data: ChatRequest, db: Session = Depends(get_db)):
    documents = onboarding_service.get_all_documents(db)
    answer    = ai_service.answer_from_docs(data.question, documents)
    return {"question": data.question, "answer": answer}