from sqlalchemy import Column, Integer, String, Text, Float
from app.database.database import Base

class PerformanceReview(Base):
    __tablename__ = "performance_reviews"

    id               = Column(Integer, primary_key=True, index=True)
    employee_id      = Column(Integer, nullable=False)
    period           = Column(String, nullable=False)   # e.g. Q2 2025
    # Self assessment
    achievements     = Column(Text, nullable=True)
    challenges       = Column(Text, nullable=True)
    goals            = Column(Text, nullable=True)
    # Manager ratings (1-5)
    quality          = Column(Float, nullable=True)
    delivery         = Column(Float, nullable=True)
    communication    = Column(Float, nullable=True)
    initiative       = Column(Float, nullable=True)
    teamwork         = Column(Float, nullable=True)
    manager_notes    = Column(Text, nullable=True)
    # AI output
    ai_summary       = Column(Text, nullable=True)
    ai_mismatch      = Column(Text, nullable=True)
    ai_actions       = Column(Text, nullable=True)
    status           = Column(String, default="draft")  # draft | submitted