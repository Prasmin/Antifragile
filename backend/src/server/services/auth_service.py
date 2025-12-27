 
from __future__ import annotations

import inspect
from typing import Any

from supabase import AsyncClient

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
            {"provider": provider_normalized, "options": {"redirect_to": redirect_url}}
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

    async def handle_oauth_callback(self, provider: str, code: str, redirect_url: str) -> dict[str, Any]:
        """Handle OAuth callback - let Supabase handle PKCE code exchange"""
        provider_normalized = provider.strip().lower()
        if provider_normalized != "google":
            raise ValueError(f"Unsupported provider: {provider}")
        try:    
               code_exchange_params = {"auth_code": code, "redirect_to": redirect_url}

            auth_response = self.client.auth.exchange_code_for_session(
                code_exchange_params
            )
        
        except Exception as e:
            raise ValueError("Missing or invalid parameters for OAuth code exchange.") 