from sqlalchemy.orm import Session
from app.models.employee import Employee


def create_employee(db: Session, employee_data):
    new_employee = Employee(**employee_data.dict())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee


def get_all_employees(db: Session):
    return db.query(Employee).all()


def get_employee(db: Session, employee_id: int):
    return db.query(Employee).filter(Employee.id == employee_id).first()


def update_employee(db: Session, employee_id: int, updated_data):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        return None
    data = updated_data.dict(exclude_unset=True)
    for key, value in data.items():
        setattr(employee, key, value)
    db.commit()
    db.refresh(employee)
    return employee


def delete_employee(db: Session, employee_id: int):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        return None
    db.delete(employee)
    db.commit()
    return employee


def deactivate_employee(db: Session, employee_id: int):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        return None
    employee.status = "inactive"
    db.commit()
    db.refresh(employee)
    return employee


def get_analytics(db: Session):
    employees = db.query(Employee).all()
    total     = len(employees)
    active    = sum(1 for e in employees if e.status == "active")
    inactive  = sum(1 for e in employees if e.status == "inactive")
    bios      = sum(1 for e in employees if e.bio)

    dept_counts = {}
    for e in employees:
        dept = e.department or "Unknown"
        dept_counts[dept] = dept_counts.get(dept, 0) + 1

    return {
        "total":       total,
        "active":      active,
        "inactive":    inactive,
        "bios":        bios,
        "by_dept":     [{"department": k, "count": v} for k, v in dept_counts.items()],
        "attrition":   round((inactive / total * 100), 1) if total else 0,
    }