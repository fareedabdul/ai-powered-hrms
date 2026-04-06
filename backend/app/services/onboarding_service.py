from sqlalchemy.orm import Session
from app.models.onboarding import OnboardingChecklist, OnboardingProgress, PolicyDocument


# ── CHECKLIST ────────────────────────────────────────────────
def create_checklist_item(db: Session, data):
    item = OnboardingChecklist(**data.dict())
    db.add(item); db.commit(); db.refresh(item)
    return item

def get_checklist_by_role(db: Session, role: str):
    return db.query(OnboardingChecklist).filter(OnboardingChecklist.role == role).all()

def get_all_checklists(db: Session):
    return db.query(OnboardingChecklist).all()

# ── PROGRESS ─────────────────────────────────────────────────
def upsert_progress(db: Session, employee_id: int, checklist_id: int, completed: bool):
    prog = db.query(OnboardingProgress).filter(
        OnboardingProgress.employee_id  == employee_id,
        OnboardingProgress.checklist_id == checklist_id
    ).first()
    if prog:
        prog.completed = completed
    else:
        prog = OnboardingProgress(employee_id=employee_id, checklist_id=checklist_id, completed=completed)
        db.add(prog)
    db.commit(); db.refresh(prog)
    return prog

def get_progress(db: Session, employee_id: int):
    return db.query(OnboardingProgress).filter(OnboardingProgress.employee_id == employee_id).all()

# ── POLICY DOCUMENTS ─────────────────────────────────────────
def add_document(db: Session, data):
    doc = PolicyDocument(**data.dict())
    db.add(doc); db.commit(); db.refresh(doc)
    return doc

def get_all_documents(db: Session):
    return db.query(PolicyDocument).all()

def search_documents(db: Session, query: str):
    q = query.lower()
    docs = db.query(PolicyDocument).all()
    return [d for d in docs if q in d.content.lower() or q in d.title.lower()]