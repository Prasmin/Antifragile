from sqlmodel import Field, SQLModel
from typing import Optional

class UserBase(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    email: str = Field(index=True)
    is_active: bool = Field(default=True)

# DB model
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: Optional[str] = None

    

