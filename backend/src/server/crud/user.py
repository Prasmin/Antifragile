from sqlmodel import Session, select
from ..models.User import User, UserCreate, UserUpdate
from typing import Optional

def create_user(session: Session, user: UserCreate) -> User:
    """Create a new user in database"""
    db_user = User.model_validate(user)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def get_user(session: Session, user_id: int) -> Optional[User]:
    """Get user by ID from database"""
    return session.get(User, user_id)

def get_user_by_username(session: Session, username: str) -> Optional[User]:
    """Get user by username from database"""
    statement = select(User).where(User.username == username)
    return session.exec(statement).first()

def get_users(session: Session, skip: int = 0, limit: int = 100) -> list[User]:
    """Get all users from database with pagination"""
    statement = select(User).offset(skip).limit(limit)
    return list(session.exec(statement).all())

def update_user(session: Session, user_id: int, user_update: UserUpdate) -> Optional[User]:
    """Update user in database"""
    db_user = session.get(User, user_id)
    if not db_user:
        return None
    
    user_data = user_update.model_dump(exclude_unset=True)
    for key, value in user_data.items():
        setattr(db_user, key, value)
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

def delete_user(session: Session, user_id: int) -> bool:
    """Delete user from database"""
    user = session.get(User, user_id)
    if not user:
        return False
    
    session.delete(user)
    session.commit()
    return True
  
