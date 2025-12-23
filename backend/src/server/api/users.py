from fastapi import APIRouter, Depends, HTTPException
from server.core.Auth import get_current_user


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
async def get_me(current_user = Depends(get_current_user)):
    """
    Get the current authenticated user's profile.
    Requires a valid JWT token in the Authorization header.
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "user_metadata": current_user.user_metadata,
        "created_at": current_user.created_at,
    }


@router.get("/profile")
async def get_profile(current_user = Depends(get_current_user)):
    """
    Get the current user's extended profile.
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "email_confirmed_at": current_user.email_confirmed_at,
        "user_metadata": current_user.user_metadata,
        "app_metadata": current_user.app_metadata,
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at,
    }
