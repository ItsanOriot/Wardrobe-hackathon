from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, scan, wardrobe, chat

app = FastAPI(
    title="AI Stylist API",
    description="Backend API for the AI Stylist wardrobe tracker application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
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
        "message": "AI Stylist API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
