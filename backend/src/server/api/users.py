from enum import Enum
from typing import Any
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pydantic import BaseModel

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


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str
    user: dict[str, Any]



async def get_auth_service() -> AuthService:
    client = await get_supabase_client()
    return AuthService(client)





def format_auth_response(result: dict[str, Any]) -> AuthResponse:
    access_token = result.get("access_token")
    refresh_token = result.get("refresh_token")
    expires_in = result.get("expires_in")
    token_type = result.get("token_type")
    user = result.get("user")

    if not access_token or not refresh_token or expires_in is None or not token_type or user is None:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supabase did not return a complete session.",
        )

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=int(expires_in),
        token_type=token_type,
        user=user,
    )


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

    


@router.post("/oauth/callback", response_model=AuthResponse, )
async def oauth_callback_get(
    request: OAuthCallbackRequest,
   auth_service: AuthService = Depends(get_auth_service)
)-> AuthResponse:
    """Browser redirect target (GET). Exchanges the code for tokens."""
    try:
        result = await auth_service.handle_oauth_callback(request.provider, request.code, request.redirect_url, request.code_verifier   ) 
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    except Exception as e:  
        raise handle_auth_error(e) from e
       
    print("Result:", result)  # shows in the Uvicorn terminal logs

    # NOTE: your format_auth_response currently expects token fields at top-level.
    # If your AuthService returns {"session": ..., "user": ...}, update format_auth_response accordingly.
    return format_auth_response(result) # Debugging statement;

