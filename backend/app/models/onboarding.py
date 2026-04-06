from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey
from app.database.database import Base


class OnboardingChecklist(Base):
    __tablename__ = "onboarding_checklists"

    id          = Column(Integer, primary_key=True, index=True)
    role        = Column(String, nullable=False)
    title       = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    due_days    = Column(Integer, default=7)       # days after joining
    assignee    = Column(String, nullable=True)


class OnboardingProgress(Base):
    __tablename__ = "onboarding_progress"

    id           = Column(Integer, primary_key=True, index=True)
    employee_id  = Column(Integer, ForeignKey("employees.id"), nullable=False)
    checklist_id = Column(Integer, ForeignKey("onboarding_checklists.id"), nullable=False)
    completed    = Column(Boolean, default=False)


class PolicyDocument(Base):
    __tablename__ = "policy_documents"

    id      = Column(Integer, primary_key=True, index=True)
    title   = Column(String, nullable=False)
    content = Column(Text, nullable=False)   # full text content of the policy
    category= Column(String, nullable=True)  # leave | tools | conduct | general