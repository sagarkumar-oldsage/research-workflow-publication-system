from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
import uuid

from src.models.research_project import ResearchProject, ResearchTask, LiteratureItem
from src.schemas.research_project import (
    ResearchProjectCreate,
    ResearchProjectUpdate,
    ResearchTaskCreate,
    LiteratureItemCreate,
)


class ResearchService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_projects(self, owner_id: uuid.UUID, skip: int = 0, limit: int = 20) -> list[ResearchProject]:
        result = await self.db.execute(
            select(ResearchProject).where(ResearchProject.owner_id == owner_id).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def create_project(self, owner_id: uuid.UUID, data: ResearchProjectCreate) -> ResearchProject:
        project = ResearchProject(**data.model_dump(), owner_id=owner_id)
        self.db.add(project)
        await self.db.flush()
        return project

    async def get_project(self, project_id: uuid.UUID) -> ResearchProject | None:
        result = await self.db.execute(select(ResearchProject).where(ResearchProject.id == project_id))
        return result.scalar_one_or_none()

    async def update_project(self, project_id: uuid.UUID, owner_id: uuid.UUID, data: ResearchProjectUpdate) -> ResearchProject:
        project = await self.get_project(project_id)
        if not project or project.owner_id != owner_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(project, field, value)
        await self.db.flush()
        return project

    async def delete_project(self, project_id: uuid.UUID, owner_id: uuid.UUID) -> None:
        project = await self.get_project(project_id)
        if not project or project.owner_id != owner_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        await self.db.delete(project)

    async def create_task(self, project_id: uuid.UUID, owner_id: uuid.UUID, data: ResearchTaskCreate) -> ResearchTask:
        project = await self.get_project(project_id)
        if not project or project.owner_id != owner_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        task = ResearchTask(**data.model_dump(), project_id=project_id)
        self.db.add(task)
        await self.db.flush()
        return task

    async def list_tasks(self, project_id: uuid.UUID, owner_id: uuid.UUID) -> list[ResearchTask]:
        project = await self.get_project(project_id)
        if not project or project.owner_id != owner_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        result = await self.db.execute(select(ResearchTask).where(ResearchTask.project_id == project_id))
        return list(result.scalars().all())

    async def add_literature_item(self, project_id: uuid.UUID, owner_id: uuid.UUID, data: LiteratureItemCreate) -> LiteratureItem:
        project = await self.get_project(project_id)
        if not project or project.owner_id != owner_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        item = LiteratureItem(**data.model_dump(), project_id=project_id)
        self.db.add(item)
        await self.db.flush()
        return item

    async def list_literature(self, project_id: uuid.UUID, owner_id: uuid.UUID) -> list[LiteratureItem]:
        project = await self.get_project(project_id)
        if not project or project.owner_id != owner_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
        result = await self.db.execute(select(LiteratureItem).where(LiteratureItem.project_id == project_id))
        return list(result.scalars().all())
