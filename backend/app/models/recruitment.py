from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from app.database.database import Base


class JobPosting(Base):
    __tablename__ = "job_postings"

    id             = Column(Integer, primary_key=True, index=True)
    title          = Column(String, nullable=False)
    department     = Column(String, nullable=True)
    description    = Column(Text, nullable=True)
    required_skills= Column(Text, nullable=True)
    experience     = Column(String, nullable=True)   # e.g. "3-5 years"
    status         = Column(String, default="open")  # open | closed


class Candidate(Base):
    __tablename__ = "candidates"

    id             = Column(Integer, primary_key=True, index=True)
    job_id         = Column(Integer, ForeignKey("job_postings.id"), nullable=False)
    name           = Column(String, nullable=False)
    email          = Column(String, nullable=True)
    resume_text    = Column(Text, nullable=True)     # pasted resume text
    stage          = Column(String, default="Applied")  # Applied | Screening | Interview | Offer | Hired | Rejected
    ai_score       = Column(Float,  nullable=True)
    ai_reasoning   = Column(Text,   nullable=True)
    ai_strengths   = Column(Text,   nullable=True)
    ai_gaps        = Column(Text,   nullable=True)
    ai_questions   = Column(Text,   nullable=True)