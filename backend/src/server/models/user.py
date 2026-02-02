from sqlmodel import Field, SQLModel

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    location: str | None = None
    gender: str | None = None
    age: int | None = Field(default=None, gt=0, lt=150)
    created_at: datetime = Field(default_factory=datetime.utcnow)

