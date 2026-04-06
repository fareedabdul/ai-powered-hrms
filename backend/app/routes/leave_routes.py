from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.leave_schema import LeaveCreate, LeaveUpdate, LeaveResponse, AttendanceCreate, AttendanceResponse
from app.services import leave_service, ai_service
from app.models.employee import Employee

router = APIRouter()

# ── LEAVE ─────────────────────────────────────────────────
@router.post("", response_model=LeaveResponse)
def apply_leave(data: LeaveCreate, db: Session = Depends(get_db)):
    return leave_service.create_leave(db, data)

@router.get("", response_model=list[LeaveResponse])
def get_all_leaves(db: Session = Depends(get_db)):
    return leave_service.get_all_leaves(db)

@router.get("/employee/{employee_id}", response_model=list[LeaveResponse])
def get_employee_leaves(employee_id: int, db: Session = Depends(get_db)):
    return leave_service.get_employee_leaves(db, employee_id)

@router.patch("/{leave_id}", response_model=LeaveResponse)
def update_leave(leave_id: int, data: LeaveUpdate, db: Session = Depends(get_db)):
    leave = leave_service.update_leave_status(db, leave_id, data)
    if not leave: raise HTTPException(status_code=404, detail="Leave not found")
    return leave

@router.get("/balance/{employee_id}")
def get_leave_balance(employee_id: int, db: Session = Depends(get_db)):
    return leave_service.get_leave_balance(db, employee_id)

@router.get("/patterns/{employee_id}")
def detect_patterns(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp: raise HTTPException(status_code=404, detail="Employee not found")
    leaves   = leave_service.get_employee_leaves(db, employee_id)
    patterns = leave_service.detect_patterns(db, employee_id)
    ai_note  = ai_service.analyze_leave_pattern(emp.name, patterns, leaves)
    return {"patterns": patterns, "ai_note": ai_note}

# ── ATTENDANCE ─────────────────────────────────────────────
@router.post("/attendance", response_model=AttendanceResponse)
def mark_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    return leave_service.mark_attendance(db, data)

@router.get("/attendance/{employee_id}", response_model=list[AttendanceResponse])
def get_attendance(employee_id: int, db: Session = Depends(get_db)):
    return leave_service.get_attendance(db, employee_id)

@router.get("/attendance/{employee_id}/summary")
def monthly_summary(employee_id: int, month: str, db: Session = Depends(get_db)):
    return leave_service.get_monthly_summary(db, employee_id, month)