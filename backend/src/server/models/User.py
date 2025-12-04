from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  username: str
  email: str
  is_active: bool = True
  created_at: Optional[str] = Field(default=None)
  updated_at: Optional[str] = Field(default=None)

  