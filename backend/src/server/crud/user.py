
from sqlmodel import Session, select
from ..models.User import User
from ..database.Session import SessionDep


async def create_user(user: User, session: SessionDep):
    """Create a new user"""
    db_user = User.model_validate(user)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user  