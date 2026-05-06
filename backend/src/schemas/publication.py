from pydantic import BaseModel
from datetime import datetime
import uuid
from src.models.publication import PublicationType, PublicationStatus
from src.models.submission import SubmissionStatus


class PublicationCreate(BaseModel):
    title: str
    abstract: str | None = None
    authors: list[str] = []
    keywords: list[str] = []
    pub_type: PublicationType
    project_id: uuid.UUID | None = None


class PublicationUpdate(BaseModel):
    title: str | None = None
    abstract: str | None = None
    authors: list[str] | None = None
    keywords: list[str] | None = None
    status: PublicationStatus | None = None
    doi: str | None = None


class PublicationResponse(BaseModel):
    id: uuid.UUID
    title: str
    abstract: str | None
    authors: list[str]
    keywords: list[str]
    pub_type: PublicationType
    status: PublicationStatus
    doi: str | None
    version: int
    project_id: uuid.UUID | None
    submitter_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class SubmissionCreate(BaseModel):
    venue_name: str
    venue_type: str
    submitted_at: datetime
    submission_url: str | None = None


class SubmissionStatusUpdate(BaseModel):
    status: SubmissionStatus
    decision_notes: str | None = None
    decision_at: datetime | None = None


class SubmissionResponse(BaseModel):
    id: uuid.UUID
    publication_id: uuid.UUID
    venue_name: str
    venue_type: str
    status: SubmissionStatus
    submitted_at: datetime
    decision_at: datetime | None
    decision_notes: str | None
    submission_url: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
