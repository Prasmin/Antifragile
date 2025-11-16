from sqlmodel import Field, SQLModel

class UserBase(SQLModel, Field=True):
    id: int | None = Field(default=None, primary_key=True)
    username: str
    email: str
    is_active: bool = Field(default=True)
    

