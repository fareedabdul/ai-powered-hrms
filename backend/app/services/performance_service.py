from sqlalchemy.orm import Session
from app.models.performance import PerformanceReview

def create_review(db: Session, data):
    review = PerformanceReview(**data.dict())
    db.add(review)
    db.commit()
    db.refresh(review)
    return review

def get_all_reviews(db: Session):
    return db.query(PerformanceReview).all()

def get_employee_reviews(db: Session, employee_id: int):
    return db.query(PerformanceReview).filter(PerformanceReview.employee_id == employee_id).all()

def get_review(db: Session, review_id: int):
    return db.query(PerformanceReview).filter(PerformanceReview.id == review_id).first()

def update_manager_review(db: Session, review_id: int, data):
    review = db.query(PerformanceReview).filter(PerformanceReview.id == review_id).first()
    if not review:
        return None
    for k, v in data.dict(exclude_unset=True).items():
        setattr(review, k, v)
    review.status = "submitted"
    db.commit()
    db.refresh(review)
    return review

def save_ai_results(db: Session, review_id: int, summary: str, mismatch: str, actions: str):
    review = db.query(PerformanceReview).filter(PerformanceReview.id == review_id).first()
    if not review:
        return None
    review.ai_summary  = summary
    review.ai_mismatch = mismatch
    review.ai_actions  = actions
    db.commit()
    db.refresh(review)
    return review