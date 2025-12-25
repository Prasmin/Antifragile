
from supabase import create_async_client, AsyncClient
import os
import dotenv


# Load environment variables from .env if present
dotenv.load_dotenv()

# Read Supabase credentials from environment
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


_supabase_client: AsyncClient | None = None

async def get_supabase_client() -> AsyncClient:
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise EnvironmentError("Supabase URL or Key not set in environment variables.")
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = await create_async_client(SUPABASE_URL, SUPABASE_KEY)
    return _supabase_client