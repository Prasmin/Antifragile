 
from __future__ import annotations

from typing import Any

from supabase import Client

from server.core.supabase_client import get_supabase_client


class AuthService:
    def __init__(self, client: Client | None = None) -> None:
        self.client = client or get_supabase_client()

    def oauth_login(self, provider: str, redirect_url: str) -> dict[str, Any]:
        """Initiate OAuth login flow (Supabase handles PKCE internally)."""
        provider_normalized = provider.strip().lower()
        if provider_normalized != "google":
            raise ValueError(f"Unsupported provider: {provider}")

        auth_response = self.client.auth.sign_in_with_oauth(
            {"provider": provider_normalized, "options": {"redirect_to": redirect_url}}
        )

        return {"auth_url": getattr(auth_response, "url", None)}