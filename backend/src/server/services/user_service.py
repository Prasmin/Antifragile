# user_service.py - User CRUD operations
from uuid import UUID
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from pydantic import BaseModel

from server.models.user import User


# ============================================================
# Request/Response Schemas
# ============================================================

class UserUpdate(BaseModel):
    """Schema for updating user profile."""
    full_name: Optional[str] = None
    location: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    email: Optional[str] = None

class UserResponse(BaseModel):
    """Schema for user response."""
    id: UUID
    full_name: str
    location: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# User Service
# ============================================================

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        """Get user by ID."""
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def create_user(
        self,
        user_id: UUID,  # From Supabase auth
        full_name: str,
        location: Optional[str] = None,
        gender: Optional[str] = None,
        age: Optional[int] = None,
    ) -> User:
        """Create a new user (called after OAuth signup)."""
        user = User(
            id=user_id,
            full_name=full_name,
            location=location,
            gender=gender,
            age=age,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def update_user(
        self,
        user_id: UUID,
        updates: UserUpdate,
    ) -> Optional[User]:
        """Update user profile."""
        user = await self.get_user_by_id(user_id)
        if not user:
            return None

        # Only update fields that were provided
        update_data = updates.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        user.updated_at = datetime.now(timezone.utc)
        
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def delete_user(self, user_id: UUID) -> bool:
        """Delete user by ID."""
        user = await self.get_user_by_id(user_id)
        if not user:
            return False
        
        await self.db.delete(user)
        await self.db.commit()
        return True

    async def get_or_create_user(
        self,
        user_id: UUID,
        full_name: str,
    ) -> User:
        """Get existing user or create new one (for OAuth flow)."""
        user = await self.get_user_by_id(user_id)
        if user:
            return user
        return await self.create_user(user_id=user_id, full_name=full_name)
