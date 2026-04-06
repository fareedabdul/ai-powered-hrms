from pydantic import BaseModel
from typing import Optional

class LeaveCreate(BaseModel):
    employee_id: int
    leave_type:  str
    start_date:  str
    end_date:    str
    reason:      Optional[str] = None

class LeaveUpdate(BaseModel):
    status:          str
    manager_comment: Optional[str] = None

class LeaveResponse(BaseModel):
    id:              int
    employee_id:     int
    leave_type:      str
    start_date:      str
    end_date:        str
    reason:          Optional[str] = None
    status:          str
    manager_comment: Optional[str] = None
    ai_flag:         Optional[str] = None

    class Config:
        from_attributes = True

class AttendanceCreate(BaseModel):
    employee_id: int
    date:        str
    status:      str

class AttendanceResponse(AttendanceCreate):
    id: int
    class Config:
        from_attributes = True