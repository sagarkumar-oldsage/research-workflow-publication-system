from pydantic import BaseModel, EmailStr
import uuid
from datetime import datetime
from src.models.user import UserRole


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    affiliation: str | None = None
    orcid_id: str | None = None


class UserUpdate(BaseModel):
    full_name: str | None = None
    affiliation: str | None = None
    orcid_id: str | None = None


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str
    role: UserRole
    is_active: bool
    affiliation: str | None
    orcid_id: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
