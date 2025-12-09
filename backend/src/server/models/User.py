from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class User(SQLModel,  table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  username: str
  email: str
  hashed_password: str
  is_active: bool = False
  created_at: datetime  = Field(default=None)
  updated_at: datetime = Field(default=None)

class UserCreate(SQLModel):
  username: str
  email: str 
  password: str

class UserRead(User):
    pass

class UserUpdate(SQLModel):
  username: Optional[str] = None
  email: Optional[str] = None
  is_active: Optional[bool] = None