from sqlalchemy import Column, Integer, String, Text, Date
from app.database.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id           = Column(Integer, primary_key=True, index=True)
    name         = Column(String, nullable=False)
    email        = Column(String, unique=True, index=True)
    department   = Column(String)
    designation  = Column(String)
    manager      = Column(String, nullable=True)
    joining_date = Column(String, nullable=True)
    contact      = Column(String, nullable=True)
    status       = Column(String, default="active")   # active | inactive
    bio          = Column(Text, nullable=True)