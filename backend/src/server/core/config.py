# config.py
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend root directory
env_path = Path(__file__).resolve().parents[3] / ".env"
load_dotenv(dotenv_path=env_path)

def get_required_env(key: str) -> str:
    value = os.getenv(key)
    if not value:
        raise ValueError(f"Required environment variable {key} is not set. Check {env_path}")
    return value

# Export validated strings
DATABASE_URL = get_required_env("SUPABASE_DB_URL")
SUPABASE_URL = get_required_env("SUPABASE_URL")
SUPABASE_KEY = get_required_env("SUPABASE_KEY")