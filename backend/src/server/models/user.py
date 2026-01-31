from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    location: str | None = None
    gender: str | None = None
    age: int | None = None

# Code below omitted 👇