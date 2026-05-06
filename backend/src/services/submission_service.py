from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
import uuid

from src.models.submission import Submission, SubmissionStatus
from src.schemas.publication import SubmissionStatusUpdate


class SubmissionService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_submissions_for_user(self, user_id: uuid.UUID, skip: int = 0, limit: int = 20) -> list[Submission]:
        from src.models.publication import Publication
        result = await self.db.execute(
            select(Submission)
            .join(Publication, Submission.publication_id == Publication.id)
            .where(Publication.submitter_id == user_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_submission(self, submission_id: uuid.UUID) -> Submission | None:
        result = await self.db.execute(select(Submission).where(Submission.id == submission_id))
        return result.scalar_one_or_none()

    async def update_status(self, submission_id: uuid.UUID, user_id: uuid.UUID, data: SubmissionStatusUpdate) -> Submission:
        submission = await self.get_submission(submission_id)
        if not submission:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(submission, field, value)
        await self.db.flush()
        return submission
