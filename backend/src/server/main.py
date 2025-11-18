from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
import sys

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup/shutdown events handler
    """
    # Startup: create tables
    try:
        from .database.dbConnection import engine
        from .models.User import User  # Import all table models here
        
        print("🚀 Creating database tables...")
        SQLModel.metadata.create_all(engine)
        print("✅ Database tables created/verified")
    except Exception as e:
        print(f"❌ Failed to initialize database: {e}", file=sys.stderr)
        sys.exit(1)
    
    yield  # App runs
    
    # Shutdown
    print("👋 Shutting down...")

app = FastAPI(lifespan=lifespan)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/health")
async def health_check():
    """
    Health check endpoint to verify DB connection
    """
    try:
        from .database.dbConnection import engine
        with engine.connect() as conn:
            return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}