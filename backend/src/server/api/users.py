from enum import StrEnum
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from pydantic import BaseModel

from server.core.supabase_client import get_supabase_client
from server.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])


class Provider(StrEnum):
    google = "google"


class OAuthLoginRequest(BaseModel):
    provider: Provider
    redirect_url: str


class OAuthCallbackRequest(BaseModel):
    provider: Provider
    code: str
    redirect_url: str


class OAuthResponse(BaseModel):
    provider: Provider
    url: str


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

@router.get("/google")
async def google_login(
    request: Request,
    redirect_url: str | None = Query(
        default=None,
        description="Optional override for OAuth redirect URL. If omitted, defaults to this API's /auth/oauth/callback.",
    ),
) -> OAuthResponse:
    redirect_to = redirect_url.strip() if redirect_url else str(request.url_for("oauth_callback_get"))
    client = await get_supabase_client()
    auth_service = AuthService(client)

    result = await auth_service.oauth_login(provider="google", redirect_url="http://localhost:8000/auth/callback")
    print("OAuth Login Result:", result)
    auth_url = result.get("auth_url")
    if not auth_url:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supabase did not return an authorization URL.",
        )
    return OAuthResponse(provider=Provider.google, url=auth_url)


@router.get("/oauth/callback", response_model=AuthResponse, name="oauth_callback_get")
async def oauth_callback_get(
    request: OAuthCallbackRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> AuthResponse:
    """Browser redirect target (GET). Exchanges the code for tokens."""
    try:
        redirect_url = str(request.url_for("oauth_callback_get"))
        result = await auth_service.handle_oauth_callback(Provider.google, code, redirect_url)
        return format_auth_response(result)
    except Exception as e:
        raise handle_auth_error(e) from e


# @router.post("/oauth/callback", response_model=AuthResponse)
# async def oauth_callback(
#     request: OAuthCallbackRequest,
#     auth_service: AuthService = Depends(get_auth_service),
# ) -> AuthResponse:
#     """Programmatic exchange (POST). Useful if frontend posts the code."""
#     try:
#         result = await auth_service.handle_oauth_callback(
#             request.provider, request.code, request.redirect_url
#         )
#         return format_auth_response(result)
#     except ValueError as e:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail=str(e),
#         ) from e
#     except Exception as e:
#         raise handle_auth_error(e) from e