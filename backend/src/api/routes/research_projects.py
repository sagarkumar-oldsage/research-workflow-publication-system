from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from src.core.database import get_db
from src.api.middleware.auth import get_current_user
from src.models.user import User
from src.schemas.research_project import (
    ResearchProjectCreate,
    ResearchProjectUpdate,
    ResearchProjectResponse,
    ResearchTaskCreate,
    ResearchTaskResponse,
    LiteratureItemCreate,
    LiteratureItemResponse,
)
from src.services.research_service import ResearchService

router = APIRouter()


@router.get("/", response_model=list[ResearchProjectResponse])
async def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ResearchService(db)
    return await service.list_projects(owner_id=current_user.id, skip=skip, limit=limit)


@router.post("/", response_model=ResearchProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    payload: ResearchProjectCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ResearchService(db)
    return await service.create_project(owner_id=current_user.id, data=payload)


@router.get("/{project_id}", response_model=ResearchProjectResponse)
async def get_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ResearchService(db)
    project = await service.get_project(project_id)
    if not project or project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


@router.patch("/{project_id}", response_model=ResearchProjectResponse)
async def update_project(
    project_id: UUID,
    payload: ResearchProjectUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ResearchService(db)
    return await service.update_project(project_id=project_id, owner_id=current_user.id, data=payload)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ResearchService(db)
    await service.delete_project(project_id=project_id, owner_id=current_user.id)


@router.post("/{project_id}/tasks", response_model=ResearchTaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    project_id: UUID,
    payload: ResearchTaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ResearchService(db)
    return await service.create_task(project_id=project_id, owner_id=current_user.id, data=payload)


@router.get("/{project_id}/tasks", response_model=list[ResearchTaskResponse])
async def list_tasks(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ResearchService(db)
    return await service.list_tasks(project_id=project_id, owner_id=current_user.id)


@router.post("/{project_id}/literature", response_model=LiteratureItemResponse, status_code=status.HTTP_201_CREATED)
async def add_literature_item(
    project_id: UUID,
    payload: LiteratureItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ResearchService(db)
    return await service.add_literature_item(project_id=project_id, owner_id=current_user.id, data=payload)


@router.get("/{project_id}/literature", response_model=list[LiteratureItemResponse])
async def list_literature(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ResearchService(db)
    return await service.list_literature(project_id=project_id, owner_id=current_user.id)
