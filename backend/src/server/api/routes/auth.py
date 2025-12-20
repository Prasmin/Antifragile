from fastapi import APIRouter, Request
import os
from dotenv import load_dotenv
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config

load_dotenv()


router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI") or None
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID') or None
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET') or None

if GOOGLE_CLIENT_ID is None or GOOGLE_CLIENT_SECRET is None:
    raise Exception('Missing env variables')

config_data = {'GOOGLE_CLIENT_ID': GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_SECRET': GOOGLE_CLIENT_SECRET}

starlette_config = Config(environ=config_data)

oauth = OAuth(starlette_config)
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
)

@router.get("/google")
async def login_google(request: Request) -> None:
    redirect_uri = GOOGLE_REDIRECT_URI
    google = oauth.create_client('google')
    if google is None:
        raise RuntimeError("Google OAuth client not registered")
    return await google.authorize_redirect(request, redirect_uri)

