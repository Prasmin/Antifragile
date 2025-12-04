import os 
from dotenv import load_dotenv

from sqlalchemy import URL
from sqlalchemy import create_engine

load_dotenv()

url_object = URL.create(
    drivername="postgresql+psycopg2",
    username=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("POSTGRES_SERVER"),
    port=int(os.getenv("POSTGRES_PORT", "5432")),
    database=os.getenv("POSTGRES_DB"),
)

engine = create_engine(url_object, echo=True, pool_pre_ping=True, pool_recycle=3600)

