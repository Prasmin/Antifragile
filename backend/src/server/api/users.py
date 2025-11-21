from fastapi import APIRouter, HTTPException
from ..database.Session import SessionDep
from ..models.User import UserCreate, UserRead, UserUpdate
from ..crud import user as user_crud

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", response_model=UserRead, status_code=201)
def create_user(user: UserCreate, session: SessionDep):
    """
    Create a new user.
    
    - **username**: Required username (must be unique)
    - **email**: Optional email address
    - **password**: Required password (will be hashed)
    """
    # Check if username already exists
    existing_user = user_crud.get_user_by_username(session, user.username)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )
    
    # Create new user
    return user_crud.create_user(session, user)

@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, session: SessionDep):
    """
    Get a user by ID.
    """
    user = user_crud.get_user(session, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/", response_model=list[UserRead])
def list_users(session: SessionDep, skip: int = 0, limit: int = 100 ):
    """
    Get all users with pagination.
    
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records to return (default: 100)
    """
    return user_crud.get_users(session, skip=skip, limit=limit)

@router.patch("/{user_id}", response_model=UserRead)
def update_user(user_id: int, user: UserUpdate, session: SessionDep):
    """
    Update a user by ID.
    """
    db_user = user_crud.update_user(session, user_id, user)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.delete("/{user_id}")
def delete_user(user_id: int, session: SessionDep):
    """
    Delete a user by ID.
    """
    success = user_crud.delete_user(session, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}
