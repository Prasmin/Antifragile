from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, SQLModel
from .dbConnection import engine
 # Example model import

def get_session():
    with Session(engine) as session:
        yield session


# Shortcut for routes
SessionDep = Annotated[Session, Depends(get_session)]

# What this does:
# Session(engine) → makes a new database session
# with ...: → ensures the session closes automatically
# yield session → gives the session to your API endpoint
# After the request finishes → session closes
# 📌 This function provides a fresh, safe database connection to each request.


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
