from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.api.users import router as users_router
import os


app = FastAPI(
    title="Antifragile API",
    description="Backend API with Google OAuth authentication",
    version="0.1.0"
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
app.include_router(users_router)



@app.get("/")
async def root():
    return {"message": "Welcome to Antifragile API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
