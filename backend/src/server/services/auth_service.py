 
from __future__ import annotations

import inspect
from typing import Any

from supabase import AsyncClient

class AuthService:
    def __init__(self, client: AsyncClient) -> None:
        self.client = client

    async def oauth_login(self, provider: str, redirect_url: str) -> dict[str, Any]:
        """Initiate OAuth login flow (Supabase handles PKCE internally)."""
        provider_normalized = provider.strip().lower()
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

        return {"auth_url": getattr(auth_response, "url", None)}

    async def handle_oauth_callback(
        self, provider: str, code: str, redirect_url: str
    ) -> dict[str, Any]:
        """Exchange OAuth code for a Supabase session (tokens)."""
        provider_normalized = provider.strip().lower()
        if provider_normalized != "google":
            raise ValueError(f"Unsupported provider: {provider}")

        exchange_fn = getattr(self.client.auth, "exchange_code_for_session", None)
        if exchange_fn is None:
            raise RuntimeError(
                "Supabase client does not expose exchange_code_for_session; check supabase package version."
            )

        # Different versions expose different signatures; try common ones.
        try:
            maybe_session = exchange_fn(code)
        except TypeError:
            try:
                maybe_session = exchange_fn({"auth_code": code, "redirect_to": redirect_url})
            except TypeError:
                maybe_session = exchange_fn({"auth_code": code})

        session = await maybe_session if inspect.isawaitable(maybe_session) else maybe_session

        # Session might be an object or dict; extract common fields defensively.
        if isinstance(session, dict):
            access_token = session.get("access_token")
            refresh_token = session.get("refresh_token")
            expires_in = session.get("expires_in")
            token_type = session.get("token_type")
            user = session.get("user")
        else:
            access_token = getattr(session, "access_token", None)
            refresh_token = getattr(session, "refresh_token", None)
            expires_in = getattr(session, "expires_in", None)
            token_type = getattr(session, "token_type", None)
            user = getattr(session, "user", None)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "expires_in": expires_in,
            "token_type": token_type,
            "user": user,
        }