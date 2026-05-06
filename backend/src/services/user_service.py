from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from src.models.user import User
from src.core.security import hash_password
from src.schemas.user import UserCreate, UserUpdate


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_user(self, data: UserCreate) -> User:
        from fastapi import HTTPException, status
        existing = await self.db.execute(select(User).where(User.email == data.email))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        user = User(
            email=data.email,
            full_name=data.full_name,
            hashed_password=hash_password(data.password),
            affiliation=data.affiliation,
            orcid_id=data.orcid_id,
        )
        self.db.add(user)
        await self.db.flush()
        return user

    async def get_user(self, user_id: uuid.UUID) -> User | None:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def update_user(self, user_id: uuid.UUID, data: UserUpdate) -> User:
        from fastapi import HTTPException, status
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(user, field, value)
        await self.db.flush()
        return user
