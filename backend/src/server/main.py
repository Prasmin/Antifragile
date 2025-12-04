from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import SQLModel, Session, select
from sqlalchemy import text
from datetime import datetime

from .models.User import User
from .database.config import engine
from .database.Session import SessionDep

app = FastAPI()

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
        # Create all tables
      
        
        # Test connection - get count of users
        result = session.exec(select(User)).all()

        return {"status": "healthy", "database": "connected", "user_count": len(result)}
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}, 500
