from pydantic import BaseModel
from datetime import datetime
import uuid
from src.models.review import ReviewStatus, ReviewDecision


class ReviewCreate(BaseModel):
    submission_id: uuid.UUID
    due_date: datetime | None = None


class ReviewUpdate(BaseModel):
    summary: str | None = None
    comments_to_authors: str | None = None
    comments_to_editors: str | None = None
    decision: ReviewDecision | None = None
    confidence_score: int | None = None


class ReviewResponse(BaseModel):
    id: uuid.UUID
    submission_id: uuid.UUID
    reviewer_id: uuid.UUID
    status: ReviewStatus
    decision: ReviewDecision | None
    summary: str | None
    comments_to_authors: str | None
    confidence_score: int | None
    due_date: datetime | None
    submitted_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}
