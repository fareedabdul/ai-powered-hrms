from sqlalchemy.orm import Session
from app.models.leave import LeaveRequest
from app.models.attendance import Attendance
from collections import Counter
import datetime

def create_leave(db: Session, data):
    leave = LeaveRequest(**data.dict())
    db.add(leave)
    db.commit()
    db.refresh(leave)
    return leave

def get_all_leaves(db: Session):
    return db.query(LeaveRequest).all()

def get_employee_leaves(db: Session, employee_id: int):
    return db.query(LeaveRequest).filter(LeaveRequest.employee_id == employee_id).all()

def update_leave_status(db: Session, leave_id: int, data):
    leave = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not leave:
        return None
    leave.status = data.status
    leave.manager_comment = data.manager_comment
    db.commit()
    db.refresh(leave)
    return leave

def get_leave_balance(db: Session, employee_id: int):
    ANNUAL = {"sick": 10, "casual": 12, "earned": 15, "wfh": 24}
    leaves = db.query(LeaveRequest).filter(
        LeaveRequest.employee_id == employee_id,
        LeaveRequest.status == "approved"
    ).all()
    used = Counter()
    for l in leaves:
        try:
            s = datetime.date.fromisoformat(l.start_date)
            e = datetime.date.fromisoformat(l.end_date)
            days = (e - s).days + 1
            used[l.leave_type] += days
        except:
            used[l.leave_type] += 1
    return {lt: {"total": tot, "used": used.get(lt, 0), "remaining": tot - used.get(lt, 0)}
            for lt, tot in ANNUAL.items()}

def detect_patterns(db: Session, employee_id: int):
    leaves = db.query(LeaveRequest).filter(
        LeaveRequest.employee_id == employee_id,
        LeaveRequest.status == "approved"
    ).all()
    monday_count = friday_count = 0
    for l in leaves:
        try:
            d = datetime.date.fromisoformat(l.start_date)
            if d.weekday() == 0: monday_count += 1
            if d.weekday() == 4: friday_count += 1
        except:
            pass
    flags = []
    if monday_count >= 2: flags.append(f"Repeated Monday leaves ({monday_count}x)")
    if friday_count >= 2: flags.append(f"Repeated Friday leaves ({friday_count}x)")
    return flags

# ── ATTENDANCE ──────────────────────────────────────────────

def mark_attendance(db: Session, data):
    existing = db.query(Attendance).filter(
        Attendance.employee_id == data.employee_id,
        Attendance.date == data.date
    ).first()
    if existing:
        existing.status = data.status
        db.commit()
        db.refresh(existing)
        return existing
    att = Attendance(**data.dict())
    db.add(att)
    db.commit()
    db.refresh(att)
    return att

def get_attendance(db: Session, employee_id: int):
    return db.query(Attendance).filter(Attendance.employee_id == employee_id).all()

def get_monthly_summary(db: Session, employee_id: int, month: str):
    records = db.query(Attendance).filter(
        Attendance.employee_id == employee_id,
        Attendance.date.startswith(month)
    ).all()
    summary = Counter(r.status for r in records)
    return {
        "month":    month,
        "present":  summary.get("present",  0),
        "absent":   summary.get("absent",   0),
        "wfh":      summary.get("wfh",      0),
        "half_day": summary.get("half_day", 0),
        "total":    len(records)
    }