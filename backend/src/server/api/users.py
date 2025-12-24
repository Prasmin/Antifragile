from fastapi import APIRouter, Query
from server.services.auth_service import AuthService


router = APIRouter(prefix="/auth", tags=["Authentication"])

auth_service = AuthService()

@router.get("/google")
def google_login(redirect_url: str = Query(...)):
    result = auth_service.oauth_login(provider="google", redirect_url=redirect_url)
    print("OAuth Login Result:", result)
    return {"url": result["auth_url"]}