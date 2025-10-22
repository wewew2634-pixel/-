"""
JJIKMEOK FastAPI Backend
Local Nano-Creator Short-Form Platform API
"""

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import Optional
import os
import logging

from db import create_tables, get_db
from routes_missions import router as missions_router
from routes_assignments import router as assignments_router
from routes_proofs import router as proofs_router
from routes_payout import router as payout_router
from routes_pulse import router as pulse_router
from routes_upload import router as upload_router
from routes_creator import router as creator_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="JJIKMEOK API",
    description="Local Nano-Creator Short-Form Platform Backend",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()
    logger.info("Database tables created/verified")

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "jjikmeok-api"}

@app.get("/")
async def root():
    return {
        "message": "JJIKMEOK API",
        "description": "Local Nano-Creator Short-Form Platform",
        "docs": "/docs",
        "health": "/health"
    }

# Include routers
app.include_router(missions_router, prefix="/v1/missions", tags=["missions"])
app.include_router(assignments_router, prefix="/v1/assignments", tags=["assignments"])
app.include_router(proofs_router, prefix="/api/proofs", tags=["proofs"])
app.include_router(payout_router, prefix="/api/payout", tags=["payout"])
app.include_router(pulse_router, prefix="/pulse", tags=["pulse"])
app.include_router(upload_router, prefix="/api", tags=["upload"])
app.include_router(creator_router, prefix="/api/creator", tags=["creator"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)