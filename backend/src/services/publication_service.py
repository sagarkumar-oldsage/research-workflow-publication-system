from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, UploadFile, status
import uuid

from src.models.publication import Publication
from src.models.submission import Submission
from src.schemas.publication import PublicationCreate, PublicationUpdate, SubmissionCreate


class PublicationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_publications(self, user_id: uuid.UUID, skip: int = 0, limit: int = 20) -> list[Publication]:
        result = await self.db.execute(
            select(Publication).where(Publication.submitter_id == user_id).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def create_publication(self, submitter_id: uuid.UUID, data: PublicationCreate) -> Publication:
        pub = Publication(**data.model_dump(), submitter_id=submitter_id)
        self.db.add(pub)
        await self.db.flush()
        return pub

    async def get_publication(self, publication_id: uuid.UUID) -> Publication | None:
        result = await self.db.execute(select(Publication).where(Publication.id == publication_id))
        return result.scalar_one_or_none()

    async def update_publication(self, publication_id: uuid.UUID, submitter_id: uuid.UUID, data: PublicationUpdate) -> Publication:
        pub = await self.get_publication(publication_id)
        if not pub or pub.submitter_id != submitter_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(pub, field, value)
        await self.db.flush()
        return pub

    async def upload_manuscript(self, publication_id: uuid.UUID, submitter_id: uuid.UUID, file: UploadFile) -> Publication:
        pub = await self.get_publication(publication_id)
        if not pub or pub.submitter_id != submitter_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
        # Storage upload handled by FileService — store path reference
        pub.manuscript_file = f"manuscripts/{publication_id}/{file.filename}"
        await self.db.flush()
        return pub

    async def create_submission(self, publication_id: uuid.UUID, submitter_id: uuid.UUID, data: SubmissionCreate) -> Submission:
        pub = await self.get_publication(publication_id)
        if not pub or pub.submitter_id != submitter_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
        submission = Submission(**data.model_dump(), publication_id=publication_id)
        self.db.add(submission)
        await self.db.flush()
        return submission

    async def list_submissions(self, publication_id: uuid.UUID, user_id: uuid.UUID) -> list[Submission]:
        pub = await self.get_publication(publication_id)
        if not pub or pub.submitter_id != user_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
        result = await self.db.execute(select(Submission).where(Submission.publication_id == publication_id))
        return list(result.scalars().all())
