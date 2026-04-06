from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.schemas.performance_schema import ReviewCreate, ReviewManagerUpdate, ReviewResponse
from app.services import performance_service, ai_service

router = APIRouter()

@router.post("", response_model=ReviewResponse)
def create_review(data: ReviewCreate, db: Session = Depends(get_db)):
    return performance_service.create_review(db, data)

@router.get("", response_model=list[ReviewResponse])
def get_all_reviews(db: Session = Depends(get_db)):
    return performance_service.get_all_reviews(db)

@router.get("/employee/{employee_id}", response_model=list[ReviewResponse])
def get_employee_reviews(employee_id: int, db: Session = Depends(get_db)):
    return performance_service.get_employee_reviews(db, employee_id)

@router.get("/{review_id}", response_model=ReviewResponse)
def get_review(review_id: int, db: Session = Depends(get_db)):
    review = performance_service.get_review(db, review_id)
    if not review: raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.put("/{review_id}/manager", response_model=ReviewResponse)
def manager_review(review_id: int, data: ReviewManagerUpdate, db: Session = Depends(get_db)):
    review = performance_service.update_manager_review(db, review_id, data)
    if not review: raise HTTPException(status_code=404, detail="Review not found")
    return review

@router.post("/{review_id}/ai")
def generate_ai_review(review_id: int, db: Session = Depends(get_db)):
    review = performance_service.get_review(db, review_id)
    if not review: raise HTTPException(status_code=404, detail="Review not found")
    result  = ai_service.generate_performance_ai(review)
    updated = performance_service.save_ai_results(db, review_id, result["summary"], result["mismatch"], result["actions"])
    return updated