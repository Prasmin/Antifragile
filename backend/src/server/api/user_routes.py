# user_routes.py - Protected user CRUD endpoints
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from server.core.supabase_client import get_db
from server.core.auth import verify_jwt, CurrentUser
from server.services.user_service import UserService, UserUpdate, UserResponse


router = APIRouter(prefix="/users", tags=["Users"])


# ============================================================
# Protected Routes - Require Authentication
# ============================================================

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: CurrentUser = Depends(verify_jwt),
    db: AsyncSession = Depends(get_db),
):
    """
    Get the current authenticated user's profile.
    
    Frontend must send: Authorization: Bearer <access_token>
    """
    service = UserService(db)
    user = await service.get_user_by_id(UUID(current_user.id))
    
    if not user:
        # User exists in Supabase Auth but not in our DB yet
        # Create their profile
        user = await service.create_user(
            user_id=UUID(current_user.id),
            full_name=current_user.full_name or current_user.email,
        )
    
    return user


@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    updates: UserUpdate,
    current_user: CurrentUser = Depends(verify_jwt),
    db: AsyncSession = Depends(get_db),
):
    """
    Update the current authenticated user's profile.
    
    Frontend must send: Authorization: Bearer <access_token>
    """
    service = UserService(db)
    user = await service.update_user(UUID(current_user.id), updates)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return user


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_current_user(
    current_user: CurrentUser = Depends(verify_jwt),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete the current authenticated user's account.
    
    Frontend must send: Authorization: Bearer <access_token>
    
    Note: This only deletes the user profile from your database.
    To fully delete from Supabase Auth, call supabase.auth.admin.deleteUser()
    """
    service = UserService(db)
    deleted = await service.delete_user(UUID(current_user.id))
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return None
