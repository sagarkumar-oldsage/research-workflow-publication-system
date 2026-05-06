from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from src.core.database import get_db
from src.api.middleware.auth import get_current_user
from src.models.user import User
from src.schemas.publication import (
    PublicationCreate,
    PublicationUpdate,
    PublicationResponse,
    SubmissionCreate,
    SubmissionResponse,
)
from src.services.publication_service import PublicationService

router = APIRouter()


@router.get("/", response_model=list[PublicationResponse])
async def list_publications(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PublicationService(db)
    return await service.list_publications(user_id=current_user.id, skip=skip, limit=limit)


@router.post("/", response_model=PublicationResponse, status_code=status.HTTP_201_CREATED)
async def create_publication(
    payload: PublicationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PublicationService(db)
    return await service.create_publication(submitter_id=current_user.id, data=payload)


@router.get("/{publication_id}", response_model=PublicationResponse)
async def get_publication(
    publication_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PublicationService(db)
    pub = await service.get_publication(publication_id)
    if not pub:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Publication not found")
    return pub


@router.patch("/{publication_id}", response_model=PublicationResponse)
async def update_publication(
    publication_id: UUID,
    payload: PublicationUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PublicationService(db)
    return await service.update_publication(publication_id=publication_id, submitter_id=current_user.id, data=payload)


@router.post("/{publication_id}/manuscript", response_model=PublicationResponse)
async def upload_manuscript(
    publication_id: UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PublicationService(db)
    return await service.upload_manuscript(publication_id=publication_id, submitter_id=current_user.id, file=file)


@router.post("/{publication_id}/submissions", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_submission(
    publication_id: UUID,
    payload: SubmissionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PublicationService(db)
    return await service.create_submission(publication_id=publication_id, submitter_id=current_user.id, data=payload)


@router.get("/{publication_id}/submissions", response_model=list[SubmissionResponse])
async def list_submissions(
    publication_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PublicationService(db)
    return await service.list_submissions(publication_id=publication_id, user_id=current_user.id)
