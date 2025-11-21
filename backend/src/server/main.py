from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
import sys
from .api import users

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

# Register routers
app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}


