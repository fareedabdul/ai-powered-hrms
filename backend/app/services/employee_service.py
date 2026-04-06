from app.models.leave import LeaveRequest
from app.models.employee import Employee

def delete_employee(db, employee_id: int):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()

    if not employee:
        return None

    # 🔥 STEP 1: sab related data delete
    db.query(LeaveRequest).filter(
        LeaveRequest.employee_id == employee_id
    ).delete(synchronize_session=False)

    # 🔥 STEP 2: employee delete
    db.delete(employee)

    db.commit()

    return employee
