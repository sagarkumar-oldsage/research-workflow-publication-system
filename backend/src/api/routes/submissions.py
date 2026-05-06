from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from src.core.database import get_db
from src.api.middleware.auth import get_current_user
from src.models.user import User
from src.schemas.publication import SubmissionResponse, SubmissionStatusUpdate
from src.services.submission_service import SubmissionService

router = APIRouter()


@router.get("/", response_model=list[SubmissionResponse])
async def list_submissions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = SubmissionService(db)
    return await service.list_submissions_for_user(user_id=current_user.id, skip=skip, limit=limit)


@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_submission(
    submission_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = SubmissionService(db)
    submission = await service.get_submission(submission_id)
    if not submission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")
    return submission


@router.patch("/{submission_id}/status", response_model=SubmissionResponse)
async def update_submission_status(
    submission_id: UUID,
    payload: SubmissionStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = SubmissionService(db)
    return await service.update_status(submission_id=submission_id, user_id=current_user.id, data=payload)
