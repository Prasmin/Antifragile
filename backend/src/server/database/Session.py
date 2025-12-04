
from sqlmodel import Session, SQLModel
from ..models.User import User
from .config import engine
from typing import Annotated
from fastapi import Depends


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

SQLModel.metadata.create_all(engine)