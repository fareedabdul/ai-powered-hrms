from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.models.leave import LeaveRequest
from app.schemas.employee_schema import EmployeeCreate, EmployeeUpdate


# ✅ CREATE EMPLOYEE
def create_employee(db: Session, employee: EmployeeCreate):
    new_employee = Employee(**employee.dict())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee


# ✅ GET ALL EMPLOYEES
def get_all_employees(db: Session):
    return db.query(Employee).all()


# ✅ GET SINGLE EMPLOYEE
def get_employee(db: Session, employee_id: int):
    return db.query(Employee).filter(Employee.id == employee_id).first()


# ✅ UPDATE EMPLOYEE
def update_employee(db: Session, employee_id: int, employee: EmployeeUpdate):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()

    if not emp:
        return None

    for key, value in employee.dict(exclude_unset=True).items():
        setattr(emp, key, value)

    db.commit()
    db.refresh(emp)
    return emp


# ✅ DELETE EMPLOYEE (🔥 FIXED VERSION)
def delete_employee(db: Session, employee_id: int):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()

    if not employee:
        return None

    try:
        # 🔥 Step 1: delete all leave records linked
        db.query(LeaveRequest).filter(
            LeaveRequest.employee_id == employee_id
        ).delete(synchronize_session=False)

        # 🔥 Step 2: delete employee
        db.delete(employee)

        # 🔥 Step 3: commit
        db.commit()

        return employee

    except Exception as e:
        db.rollback()
        print("Error deleting employee:", str(e))
        return None


# ✅ DEACTIVATE EMPLOYEE
def deactivate_employee(db: Session, employee_id: int):
    emp = db.query(Employee).filter(Employee.id == employee_id).first()

    if not emp:
        return None

    emp.status = "Inactive"
    db.commit()
    db.refresh(emp)

    return emp


# ✅ ANALYTICS (Basic)
def get_analytics(db: Session):
    employees = db.query(Employee).all()

    total = len(employees)
    active = len([e for e in employees if e.status == "Active"])
    inactive = len([e for e in employees if e.status == "Inactive"])

    departments = {}
    for e in employees:
        dept = e.department or "Unknown"
        departments[dept] = departments.get(dept, 0) + 1

    return {
        "total_employees": total,
        "active_employees": active,
        "inactive_employees": inactive,
        "department_distribution": departments
    }
