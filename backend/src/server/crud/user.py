from sqlmodel import  select
from ..models.User import UserCreate, User
from ..database.Session import SessionDep, get_session
from ..core.security import hash_password


async def create_user(user: UserCreate, session: SessionDep):
    """Create a new user"""
    # ...existing code...
    hashed = hash_password(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed,
    )
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
   
    return db_user


