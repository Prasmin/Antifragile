from typing import Optional

from sqlmodel import Field, SQLModel


# Shared schema for user fields used by multiple DTOs
class UserBase(SQLModel):
    username: str
    email: Optional[str] = None
    is_active: bool = True


# Database model (table)
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: Optional[str] = None


# DTO used when creating a user (input)
class UserCreate(UserBase):
    username: str
  
    password: str


# DTO used when returning user data (output)
class UserRead(UserBase):
    id: int


# DTO for updates (all fields optional for partial updates)
class UserUpdate(SQLModel):
    username: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None



    

