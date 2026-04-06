import csv
import io
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.employee_schema import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from app.services import employee_service, ai_service
from app.models.employee import Employee

router = APIRouter()

# ── ANALYTICS (before /{id} to avoid conflict) ──────────────
@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    return employee_service.get_analytics(db)

@router.get("/analytics/summary")
def get_analytics_summary(db: Session = Depends(get_db)):
    analytics = employee_service.get_analytics(db)
    return {"summary": ai_service.generate_analytics_summary(analytics)}

@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db)):
    employees = employee_service.get_all_employees(db)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID","Name","Email","Department","Designation","Manager","Joining Date","Contact","Status"])
    for e in employees:
        writer.writerow([e.id, e.name, e.email, e.department, e.designation, e.manager, e.joining_date, e.contact, e.status])
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=employees.csv"})

# ── CRUD ────────────────────────────────────────────────────
@router.post("", response_model=EmployeeResponse)
def add_employee(employee: EmployeeCreate, db: Session = Depends(get_db)):
    return employee_service.create_employee(db, employee)

@router.get("", response_model=list[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    return employee_service.get_all_employees(db)

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    emp = employee_service.get_employee(db, employee_id)
    if not emp: raise HTTPException(status_code=404, detail="Employee not found")
    return emp

@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(employee_id: int, employee: EmployeeUpdate, db: Session = Depends(get_db)):
    updated = employee_service.update_employee(db, employee_id, employee)
    if not updated: raise HTTPException(status_code=404, detail="Employee not found")
    return updated

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    deleted = employee_service.delete_employee(db, employee_id)
    if not deleted: raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee deleted successfully"}

@router.patch("/{employee_id}/deactivate", response_model=EmployeeResponse)
def deactivate_employee(employee_id: int, db: Session = Depends(get_db)):
    emp = employee_service.deactivate_employee(db, employee_id)
    if not emp: raise HTTPException(status_code=404, detail="Employee not found")
    return emp

# ── AI ───────────────────────────────────────────────────────
@router.get("/{employee_id}/bio")
def generate_bio(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp: raise HTTPException(status_code=404, detail="Employee not found")
    bio = ai_service.generate_employee_bio(emp)
    emp.bio = bio
    db.commit()
    return {"bio": bio}

@router.get("/{employee_id}/skills")
def generate_skills(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp: raise HTTPException(status_code=404, detail="Employee not found")
    return {"skills": ai_service.generate_skills(emp)}

@router.get("/{employee_id}/review")
def generate_review(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp: raise HTTPException(status_code=404, detail="Employee not found")
    return {"review": ai_service.generate_review(emp)}

@router.get("/{employee_id}/issues")
def detect_issues(employee_id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()
    if not emp: raise HTTPException(status_code=404, detail="Employee not found")
    return {"issues": ai_service.detect_profile_issues(emp)}