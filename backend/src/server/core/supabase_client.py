# database.py
from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from supabase import create_async_client, AsyncClient
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Depends
import os

# SQLModel Setup (Direct PostgreSQL)
engine = create_async_engine(
    os.getenv("SUPABASE_DB_URL"),
    echo=True,
    pool_size=5,
    max_overflow=10,
    pool_recycle=3600  # Supabase drops idle connections
)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Supabase Client Setup (Your existing pattern, but improved)
class SupabaseManager:
    def __init__(self):
        self._client: AsyncClient | None = None
    
    async def initialize(self):
        self._client = await create_async_client(
            os.getenv("SUPABASE_URL"),
            os.getenv("SUPABASE_KEY")
        )
    
    async def close(self):
        if self._client:
            await self._client.aclose()
    
    @property
    def client(self) -> AsyncClient:
        if not self._client:
            raise RuntimeError("Supabase not initialized")
        return self._client

supabase_manager = SupabaseManager()

# FastAPI Lifespan (Manages both)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await supabase_manager.initialize()
    # Create SQLModel tables (use Alembic in production instead)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    # Shutdown
    await supabase_manager.close()

# Dependencies
async def get_db() -> AsyncSession:
    """SQLModel Database Session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

def get_supabase() -> AsyncClient:
    """Supabase HTTP Client"""
    return supabase_manager.client