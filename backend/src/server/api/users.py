from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from server.core.supabase_client import get_supabase_client
from server.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])


class OAuthLoginRequest(BaseModel):
    provider: str
    redirect_url: str


class OAuthCallbackRequest(BaseModel):
    provider: str
    code: str
    redirect_url: str


class OAuthResponse(BaseModel):
    url: str | None


class AuthResponse(BaseModel):
    access_token: str | None = None
    refresh_token: str | None = None
    expires_in: int | None = None
    token_type: str | None = None
    user: dict[str, Any] | None = None


async def get_auth_service() -> AuthService:
    client = await get_supabase_client()
    return AuthService(client)


def format_auth_response(result: dict[str, Any]) -> AuthResponse:
    return AuthResponse(
        access_token=result.get("access_token"),
        refresh_token=result.get("refresh_token"),
        expires_in=result.get("expires_in"),
        token_type=result.get("token_type"),
        user=result.get("user"),
    )


def handle_auth_error(error: Exception) -> HTTPException:
    return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error))

@router.get("/google")
async def google_login(redirect_url: str = Query(...)) -> OAuthResponse:
    client = await get_supabase_client()
    auth_service = AuthService(client)
    result = await auth_service.oauth_login(provider="google", redirect_url=redirect_url)
    print("OAuth Login Result:", result)
    return OAuthResponse(url=result["auth_url"])


@router.post("/oauth/callback", response_model=AuthResponse)
async def oauth_callback(
    request: OAuthCallbackRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> AuthResponse:
    """Handle Google OAuth callback and exchange code for tokens"""
    try:
        result = await auth_service.handle_oauth_callback(
            request.provider, request.code, request.redirect_url
        )
        return format_auth_response(result)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e
    except Exception as e:
        raise handle_auth_error(e) from e

