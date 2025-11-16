from typing import Annotated
from fastapi import Depends
from sqlmodel import Session
from .dbConnection import engine


def get_session():
    with Session(engine) as session:
        yield session


# Shortcut for routes
SessionDep = Annotated[Session, Depends(get_session)]
