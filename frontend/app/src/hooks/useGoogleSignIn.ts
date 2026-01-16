import { useCallback } from "react";

export function useGoogleSignIn() {
  return useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          redirect_url: "http://localhost:8000/auth/callback",
        }),
      });
      const data = await res.json();
      if (data.auth_url) {
        window.location.href = data.auth_url;
      } else {
        throw new Error("No auth_url returned from backend");
      }
    } catch (error) {
      // Optionally handle error (e.g., show notification)
      console.error("Google sign-in failed:", error);
    }
  }, []);
}
