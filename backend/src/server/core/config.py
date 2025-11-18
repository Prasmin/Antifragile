from pathlib import Path
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus


# Load nearest .env upwards from this file's location
root = Path(__file__).resolve()
for _ in range(10):
    candidate = root
    if (candidate / ".env").exists():
        load_dotenv(candidate / ".env")
        break
    root = root.parent


POSTGRES_SERVER = os.getenv("POSTGRES_SERVER")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")


def build_database_url() -> str:
    if not POSTGRES_SERVER or not POSTGRES_DB:
        # fallback to sqlite for local/dev convenience
        return "sqlite:///./dev.db"
    user = quote_plus(POSTGRES_USER or "")
    pwd = quote_plus(POSTGRES_PASSWORD or "")
    host = POSTGRES_SERVER
    port = POSTGRES_PORT
    db = POSTGRES_DB
    return f"postgresql://{user}:{pwd}@{host}:{port}/{db}"


DATABASE_URL = build_database_url()
