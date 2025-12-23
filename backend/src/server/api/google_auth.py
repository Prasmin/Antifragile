from fastapi import APIRouter, HTTPException, Request, Query
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from server.core.config import supabase
import os


router = APIRouter(prefix="/auth", tags=["Authentication"])


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict


class RefreshTokenRequest(BaseModel):
    refresh_token: str


# Frontend redirect URL after OAuth
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")


@router.get("/google")
async def google_login(redirect_url: str = Query(default=None)):
    """
    Initiate Google OAuth login.
    Returns the URL to redirect the user to Google's OAuth consent screen.
    """
    try:
        # Use provided redirect_url or default
        callback_url = redirect_url or f"{FRONTEND_URL}/auth/callback"
        
        # Get the OAuth URL from Supabase
        response = supabase.auth.sign_in_with_oauth({
            "provider": "google",
            "options": {
                "redirect_to": callback_url,
            }
        })
        
        if response and response.url:
            return {"url": response.url}
        
        raise HTTPException(
            status_code=500,
            detail="Failed to generate Google OAuth URL"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to initiate Google login: {str(e)}"
        )


@router.post("/google/callback", response_model=TokenResponse)
async def google_callback(code: str = Query(...)):
    """
    Handle the OAuth callback from Google.
    Exchange the authorization code for tokens.
    """
    try:
        # Exchange the code for a session
        response = supabase.auth.exchange_code_for_session({"auth_code": code})
        
        if response and response.session:
            session = response.session
            user = response.user
            
            return TokenResponse(
                access_token=session.access_token,
                refresh_token=session.refresh_token,
                expires_in=session.expires_in,
                user={
                    "id": user.id,
                    "email": user.email,
                    "user_metadata": user.user_metadata,
                }
            )
        
        raise HTTPException(
            status_code=400,
            detail="Failed to exchange code for session"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"OAuth callback failed: {str(e)}"
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest):
    """
    Refresh the access token using a refresh token.
    """
    try:
        response = supabase.auth.refresh_session(request.refresh_token)
        
        if response and response.session:
            session = response.session
            user = response.user
            
            return TokenResponse(
                access_token=session.access_token,
                refresh_token=session.refresh_token,
                expires_in=session.expires_in,
                user={
                    "id": user.id,
                    "email": user.email,
                    "user_metadata": user.user_metadata,
                }
            )
        
        raise HTTPException(
            status_code=401,
            detail="Failed to refresh token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Token refresh failed: {str(e)}"
        )


@router.post("/logout")
async def logout():
    """
    Log out the current user (invalidate the session on server side).
    """
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Logout failed: {str(e)}"
        )


@router.get("/me")
async def get_current_user_info(token: str = Query(...)):
    """
    Get the current user's information using their access token.
    """
    try:
        response = supabase.auth.get_user(token)
        
        if response and response.user:
            user = response.user
            return {
                "id": user.id,
                "email": user.email,
                "email_confirmed_at": user.email_confirmed_at,
                "user_metadata": user.user_metadata,
                "created_at": user.created_at,
            }
        
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Failed to get user info: {str(e)}"
        )
