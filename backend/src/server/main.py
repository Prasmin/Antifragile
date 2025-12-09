from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import SQLModel, Session, select
from sqlalchemy import text
from datetime import datetime

from .models.User import User
from .database.config import engine
from .database.Session import SessionDep

app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP
    print("🚀 Creating database tables...")
    SQLModel.metadata.create_all(engine)
    print("✅ Tables created!")
    yield
    # SHUTDOWN
    print("👋 Shutting down...")
    engine.dispose()

app = FastAPI(lifespan=lifespan)

@app.get("/")
def root():
    """Root endpoint"""
    return {"message": "API is running"}

@app.get("/health")
def health_check():
    """Basic health check"""
    return {"status": "healthy"}

@app.get("/health/db")
def database_health(session: SessionDep):
    """Check if database connection is working"""
    try:
       
        
        # Test connection - get count of users
        result = session.exec(select(User)).all()

        return {"status": "healthy", "database": "connected", "user_count": len(result)}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}, 500
