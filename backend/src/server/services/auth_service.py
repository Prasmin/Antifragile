 
from __future__ import annotations

import inspect
from typing import Any, Optional

from supabase import AsyncClient
from supabase_auth import CodeExchangeParams
from server.core.supabase_client import get_supabase_client

class AuthService:
    def __init__(self, client: AsyncClient):
        self.client = client

    async def oauth_login(self, provider: str, redirect_url: str) -> dict[str, Any]:
        """Initiate OAuth login flow (Supabase handles PKCE internally)."""
        provider_normalized = provider.strip().lower()
        redirect_url = redirect_url.strip()
        
        if provider_normalized != "google":
            raise ValueError(f"Unsupported provider: {provider}")

        maybe_auth_response = self.client.auth.sign_in_with_oauth(
            {"provider": provider_normalized, "options": {"redirect_to": "http://localhost:8000/auth/callback"}}
        )

        auth_response = (
            await maybe_auth_response
            if inspect.isawaitable(maybe_auth_response)
            else maybe_auth_response
        )

        auth_url = getattr(auth_response, "url", None)
        if not auth_url:
            raise RuntimeError("Supabase did not return an authorization URL.")

        return {"auth_url": auth_url}

    async def handle_oauth_callback(
        self, provider: str, code: str, redirect_url: str, code_verifier: Optional[str] = None
    ) -> dict[str, Any]:
        """Handle OAuth callback - exchange auth code for session (PKCE requires code_verifier)."""
        provider_normalized = provider.strip().lower()
        if provider_normalized != "google":
            raise ValueError(f"Unsupported provider: {provider}")

      

        try:
            
             auth_response = await self.client.auth.exchange_code_for_session({
                "code_verifier": code_verifier.strip(),
                "auth_code": code.strip(), 
                "redirect_to": redirect_url.strip(),
                
            })
            
        except Exception as e:
            raise ValueError(f"OAuth code exchange failed: {e!r}") from e

        return {
            "session": getattr(auth_response, "session", None),
            "user": getattr(auth_response, "user", None),
            "auth_response": auth_response
        }