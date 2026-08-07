from fastapi import FastAPI
from core.config import settings


# Create the FastAPI application
app = FastAPI(
    title=settings.app_name,
    version="1.0.0"
)


# Root endpoint
@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.app_name}"
    }


# Health check endpoint
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }