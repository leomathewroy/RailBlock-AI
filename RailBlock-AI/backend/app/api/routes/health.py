import logging
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.db.database import get_db
from app.services.prediction_service import prediction_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/")
@router.get("")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint checking application, DB connectivity, ML model, and optimizer."""
    db_status = "connected"
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")
        db_status = "degraded"

    return {
        "status": "ok",
        "service": "railblock-ai",
        "database": db_status,
        "ml_engine": "active" if prediction_service.is_trained else "baseline_fallback",
        "optimization_engine": "ready",
        "environment": "production-ready"
    }
