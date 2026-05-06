from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from datetime import datetime, timezone
import uuid

from src.models.review import Review, ReviewStatus
from src.schemas.review import ReviewCreate, ReviewUpdate


class ReviewService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_reviews_for_reviewer(self, reviewer_id: uuid.UUID, skip: int = 0, limit: int = 20) -> list[Review]:
        result = await self.db.execute(
            select(Review).where(Review.reviewer_id == reviewer_id).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def create_review(self, reviewer_id: uuid.UUID, data: ReviewCreate) -> Review:
        review = Review(**data.model_dump(), reviewer_id=reviewer_id, status=ReviewStatus.INVITED)
        self.db.add(review)
        await self.db.flush()
        return review

    async def get_review(self, review_id: uuid.UUID) -> Review | None:
        result = await self.db.execute(select(Review).where(Review.id == review_id))
        return result.scalar_one_or_none()

    async def update_review(self, review_id: uuid.UUID, reviewer_id: uuid.UUID, data: ReviewUpdate) -> Review:
        review = await self.get_review(review_id)
        if not review or review.reviewer_id != reviewer_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(review, field, value)
        if review.status == ReviewStatus.INVITED:
            review.status = ReviewStatus.IN_PROGRESS
        await self.db.flush()
        return review

    async def submit_review(self, review_id: uuid.UUID, reviewer_id: uuid.UUID) -> Review:
        review = await self.get_review(review_id)
        if not review or review.reviewer_id != reviewer_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
        if not review.decision:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Decision is required before submitting")
        review.status = ReviewStatus.COMPLETED
        review.submitted_at = datetime.now(timezone.utc)
        await self.db.flush()
        return review
