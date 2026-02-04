from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from server.api.user_routes import router as users_router

from contextlib import asynccontextmanager
from server.core.supabase_client import supabase_manager
from server.core.supabase_client import engine
import os

from sqlmodel import SQLModel


@asynccontextmanager
async def lifespan(_app: FastAPI): 
    # Startup
    await supabase_manager.initialize()
    
    # Create tables (async-safe)
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    
    yield
    
    # Shutdown ( dispose async engine)
    await supabase_manager.close()
    await engine.dispose()  # Async engines need await dispose()


app = FastAPI(
    title="Antifragile API",
    description="Backend API with Google OAuth authentication",
    version="0.1.0",
    lifespan=lifespan,  # Connect the lifespan handler
)

# CORS configuration
origins = [
    "http://localhost:3000",
    os.environ.get("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],  # Filter empty strings
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(users_router)  # /users/* routes (protected CRUD)



@app.get("/")
async def root():
    return {"message": "Welcome to Antifragile API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
