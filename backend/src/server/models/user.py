from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from datetime import datetime, timezone
from typing import Optional


class User(SQLModel, table=True):
    """User profile table - linked to Supabase Auth via id (UUID)."""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    full_name: str = Field(index=True)
    location: str | None = None
    gender: str | None = None
    age: int | None = Field(default=None, gt=0, lt=150)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))



