from enum import Enum
from typing import Any
from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
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
    redirect_url: str 
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
        print("result:", result)  # shows in the Uvicorn terminal logs
        return OAuthResponse(auth_url=result["auth_url"])
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    except Exception as e:
        raise handle_auth_error(e) from e

    


@router.post("/oauth/callback", response_model=AuthResponse, )
async def oauth_callback_get(
    request: Request,
   auth_service: AuthService = Depends(get_auth_service)
)-> AuthResponse:
    
    code = request.query_params.get("code")
    provider = request.query_params.get("provider", "google")  # default to google
    redirect_url = "http://localhost:3000/dashboard"  # hardcoded safe redirect
    code_verifier = None  # optional, retrieved from PKCE storage if needed

    if not code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No code found in query parameters"
        )
    """Browser redirect target (GET). Exchanges the code for tokens."""
    try:
        result = await auth_service.handle_oauth_callback(  
            provider,
            code,
            redirect_url,
            code_verifier)  
        print("OAuth callback result:", result)  # Debugging statement
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    except Exception as e:  
        raise handle_auth_error(e) from e

    # NOTE: your format_auth_response currently expects token fields at top-level.
    # If your AuthService returns {"session": ..., "user": ...}, update format_auth_response accordingly.
    return format_auth_response(result) # Debugging statement;

