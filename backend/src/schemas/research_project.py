from pydantic import BaseModel
from datetime import datetime
import uuid
from src.models.research_project import ProjectStatus, TaskStatus


class ResearchProjectCreate(BaseModel):
    title: str
    description: str | None = None
    keywords: list[str] = []
    funding_source: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None


class ResearchProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    status: ProjectStatus | None = None
    keywords: list[str] | None = None
    funding_source: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None


class ResearchProjectResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    status: ProjectStatus
    keywords: list[str]
    funding_source: str | None
    start_date: datetime | None
    end_date: datetime | None
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ResearchTaskCreate(BaseModel):
    title: str
    description: str | None = None
    due_date: datetime | None = None
    assignee_id: uuid.UUID | None = None


class ResearchTaskResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    title: str
    description: str | None
    status: TaskStatus
    due_date: datetime | None
    assignee_id: uuid.UUID | None
    created_at: datetime

    model_config = {"from_attributes": True}


class LiteratureItemCreate(BaseModel):
    title: str
    authors: list[str] = []
    doi: str | None = None
    abstract: str | None = None
    notes: str | None = None
    tags: list[str] = []
    year: int | None = None


class LiteratureItemResponse(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    title: str
    authors: list[str]
    doi: str | None
    abstract: str | None
    notes: str | None
    tags: list[str]
    year: int | None
    created_at: datetime

    model_config = {"from_attributes": True}
