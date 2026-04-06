from pydantic import BaseModel
from typing import Optional

class EmployeeCreate(BaseModel):
    name:         str
    email:        str
    department:   str
    designation:  str
    manager:      Optional[str] = None
    joining_date: Optional[str] = None
    contact:      Optional[str] = None
    status:       Optional[str] = "active"

class EmployeeUpdate(BaseModel):
    name:         Optional[str] = None
    email:        Optional[str] = None
    department:   Optional[str] = None
    designation:  Optional[str] = None
    manager:      Optional[str] = None
    joining_date: Optional[str] = None
    contact:      Optional[str] = None
    status:       Optional[str] = None

class EmployeeResponse(BaseModel):
    id:           int
    name:         str
    email:        str
    department:   Optional[str] = None
    designation:  Optional[str] = None
    manager:      Optional[str] = None
    joining_date: Optional[str] = None
    contact:      Optional[str] = None
    status:       Optional[str] = "active"
    bio:          Optional[str] = None

    class Config:
        from_attributes = True