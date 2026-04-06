from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.database import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id          = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date        = Column(String, nullable=False)
    status      = Column(String, nullable=False)  # present | absent | wfh | half_day