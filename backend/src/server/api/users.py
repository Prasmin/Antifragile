from enum import Enum
from typing import Any
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request, params, status
from pydantic import BaseModel, EmailStr

from server.core.supabase_client import get_supabase_client
from server.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])


class Provider(str, Enum):
    google = "google"


class OAuthLoginRequest(BaseModel):
    provider: Provider
    redirect_url: str
    


class OAuthCallbackRequest(BaseModel):
    provider: Provider
    code: str
    redirect_to: str 
    code_verifier: str 


class OAuthResponse(BaseModel):
    auth_url: str

class UserBase(BaseModel):
    """Base user schema"""

    email: EmailStr

class UserResponse(UserBase):
    """User response schema"""

    id: str
    full_name: str
    created_at: datetime | None = None


class TokenResponse(BaseModel):
    """Token response schema"""

    access_token: str = ""
    refresh_token: str = ""
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    """Authentication response schema"""

    user: UserResponse
    token: TokenResponse




async def get_auth_service() -> AuthService:
    client = await get_supabase_client()
    return AuthService(client)





def format_auth_response(result: dict[str, Any]) -> AuthResponse:
    
   

    user_response = UserResponse(
        id=result["user"]["id"],
        full_name=result["user"].get("full_name", ""),
        email=result["user"]["email"],
       
    )

    # Handle optional session data
    token_response = TokenResponse(
        access_token="",
        refresh_token="",
        token_type="bearer",
    )

    # Safely handle session data which might be dict or other type
    session_data = result.get("session")
    if (
        session_data
        and isinstance(session_data, dict)
        and session_data.get("access_token")
    ):
        token_response = TokenResponse(
            access_token=session_data["access_token"],
            refresh_token=session_data["refresh_token"],
            token_type="bearer",
        )

    return AuthResponse(user=user_response, token=token_response)

def handle_auth_error(error: Exception) -> HTTPException:
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))



@router.post("/google", response_model=OAuthResponse)
async def google_login(
    request: OAuthLoginRequest,
  auth_service: AuthService = Depends(get_auth_service)
) -> OAuthResponse:
    
    try:
        result = await auth_service.oauth_login(request.provider, request.redirect_url)
        
        return OAuthResponse(auth_url=result["auth_url"])
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    except Exception as e:
        raise handle_auth_error(e) from e

    
@router.post("/callback", response_model=AuthResponse)
async def oauth_callback(
    request: OAuthCallbackRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> AuthResponse:
    print("request:", request)
    """Handle Google OAuth callback and exchange code for tokens"""
    try:
        result = await auth_service.handle_oauth_callback(
            request.provider, request.code, request.redirect_to, request.code_verifier
        )
        return format_auth_response(result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    except Exception as e:
        raise handle_auth_error(e) from e