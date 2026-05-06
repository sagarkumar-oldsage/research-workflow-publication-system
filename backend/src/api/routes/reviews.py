from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from src.core.database import get_db
from src.api.middleware.auth import get_current_user
from src.models.user import User
from src.schemas.review import ReviewCreate, ReviewUpdate, ReviewResponse
from src.services.review_service import ReviewService

router = APIRouter()


@router.get("/", response_model=list[ReviewResponse])
async def list_my_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ReviewService(db)
    return await service.list_reviews_for_reviewer(reviewer_id=current_user.id, skip=skip, limit=limit)


@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    payload: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ReviewService(db)
    return await service.create_review(reviewer_id=current_user.id, data=payload)


@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(
    review_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ReviewService(db)
    review = await service.get_review(review_id)
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    return review


@router.patch("/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: UUID,
    payload: ReviewUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ReviewService(db)
    return await service.update_review(review_id=review_id, reviewer_id=current_user.id, data=payload)


@router.post("/{review_id}/submit", response_model=ReviewResponse)
async def submit_review(
    review_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ReviewService(db)
    return await service.submit_review(review_id=review_id, reviewer_id=current_user.id)
