from sqlalchemy import URL
from sqlmodel import SQLModel, create_engine
import os
import sys
from dotenv import load_dotenv

# Load local .env file (will be ignored if running on Render)
load_dotenv()

url_object = URL.create(
    "postgresql+psycopg2",
    username=os.getenv("POSTGRES_USER"),
    password=os.getenv("POSTGRES_PASSWORD"),
    host=os.getenv("POSTGRES_SERVER"),
    port=int(os.getenv("POSTGRES_PORT", "5432")),
    database=os.getenv("POSTGRES_DB"),
)

"""
The engine manages the connection to the database and handles query execution.
"""


try: 
  engine = create_engine(url_object, echo=False)

  with engine.connect() as conn:
      print("✅ Database connection successful")


except Exception as e:
    print(f"❌ Database connection failed: {e}")

