from supabase import create_client, Client
import os
import dotenv


# Load environment variables from .env if present
dotenv.load_dotenv()

# Read Supabase credentials from environment
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


# Backing singleton reference
_supabase_client: Client | None = None




def get_supabase_client() -> Client:
    """Get Supabase client instance (singleton to preserve PKCE state)."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY in environment")
    
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase_client
