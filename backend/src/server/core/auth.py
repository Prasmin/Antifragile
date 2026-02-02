# auth.py - JWT verification for protected routes
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import AsyncClient
from pydantic import BaseModel
from typing import Optional

from server.core.supabase_client import get_supabase


# Security scheme for Swagger UI
security = HTTPBearer()


class CurrentUser(BaseModel):
    """Authenticated user from JWT token."""
    id: str
    email: str
    full_name: Optional[str] = None
    

async def verify_jwt(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase: AsyncClient = Depends(get_supabase),
) -> CurrentUser:
    """
    Verify JWT token and return current user.
    
    Frontend must send: Authorization: Bearer <access_token>
    """
    token = credentials.credentials
    
    try:
        # Verify token with Supabase - this validates the JWT
        response = await supabase.auth.get_user(token)
        print(response)

        if response is None or response.user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user = response.user
        
        return CurrentUser(
            id=str(user.id),
            email=str(user.email),
            full_name=user.user_metadata.get("full_name") or user.user_metadata.get("name") if user.user_metadata else None,
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Optional: Get user if token provided, None if not
async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    supabase: AsyncClient = Depends(get_supabase),
) -> Optional[CurrentUser]:
    """Get current user if authenticated, None otherwise."""
    if not credentials:
        return None
    
    try:
        return await verify_jwt(credentials, supabase)
    except HTTPException:
        return None
