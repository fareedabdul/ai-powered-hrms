from sqlalchemy import Column, Integer, String, Text, ForeignKey
from app.database.database import Base

class LeaveRequest(Base):
    __tablename__ = "leave_requests"

    id          = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type  = Column(String, nullable=False)   # sick | casual | earned | wfh
    start_date  = Column(String, nullable=False)
    end_date    = Column(String, nullable=False)
    reason      = Column(Text, nullable=True)
    status      = Column(String, default="pending") # pending | approved | rejected
    manager_comment = Column(Text, nullable=True)
    ai_flag     = Column(Text, nullable=True)       # AI pattern detection note