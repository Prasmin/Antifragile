

from sqlmodel import SQLModel  
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker  
from supabase import create_async_client, AsyncClient
from contextlib import asynccontextmanager
from fastapi import FastAPI
from typing import AsyncGenerator




from .config import DATABASE_URL, SUPABASE_URL, SUPABASE_KEY



#  Use create_async_engine 

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_size=5,
    max_overflow=10,
    pool_recycle=3600,
    pool_pre_ping=True,
)

#  Use async_sessionmaker (
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,  
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


# ============================================================
# Supabase Client (HTTP API)
# ============================================================

class SupabaseManager:
    def __init__(self):
        self._client: AsyncClient | None = None

    async def initialize(self):
        self._client = await create_async_client(
            SUPABASE_URL,
            SUPABASE_KEY,
        )

    async def close(self):
        if self._client:
            # Close the underlying httpx async client
            await self._client.postgrest.aclose()
            self._client = None

    @property
    def client(self) -> AsyncClient:
        if not self._client:
            raise RuntimeError("Supabase not initialized")
        return self._client

supabase_manager = SupabaseManager()


# ============================================================
# FastAPI Lifespan (FIXED)
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await supabase_manager.initialize()
    
    # Create tables (async-safe)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
    yield
    
    # Shutdown ( dispose async engine)
    await supabase_manager.close()
    await engine.dispose()  # Async engines need await dispose()


# ============================================================
# Dependencies (FIXED)
# ============================================================

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """SQLModel AsyncSession dependency"""
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
    """Supabase HTTP client"""
    return supabase_manager.client