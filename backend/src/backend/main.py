
from fastapi import FastAPI

app = FastAPI(
    title="Goodwill API",
    description="Inventory & Delivery Management System",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Welcome to Goodwill API",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Goodwill Backend",
    }
