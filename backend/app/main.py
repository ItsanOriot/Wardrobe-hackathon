import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, scan, wardrobe, chat

app = FastAPI(
    title="StyleIt API",
    description="Backend API for the StyleIt wardrobe tracker application",
    version="1.0.0"
)

# Configure CORS - supports both local development and production
allowed_origins = [
    "http://localhost:3000",  # Local development
    "http://127.0.0.1:3000",  # Alternative local
]

# Add production frontend URL if environment variable is set
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)
    # Also allow preview deployments on Vercel
    if "vercel.app" in frontend_url:
        allowed_origins.append("https://*.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(scan.router)
app.include_router(wardrobe.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {
        "message": "StyleIt API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
