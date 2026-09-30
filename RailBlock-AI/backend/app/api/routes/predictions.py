import logging
from fastapi import APIRouter, HTTPException
from app.schemas.prediction import (
    DelayPredictionRequest,
    DelayPredictionResponse,
    AssetRiskPredictionRequest,
    AssetRiskPredictionResponse
)
from app.services.prediction_service import prediction_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/delay", response_model=DelayPredictionResponse)
async def predict_train_delay(req: DelayPredictionRequest):
    """
    Predict expected train delay based on route characteristics, distance, scheduled hour,
    and historical trends using XGBoost/Scikit-learn with baseline fallback.
    """
    try:
        predicted_delay, confidence, category, is_fallback = prediction_service.predict_delay(
            train_number=req.train_number,
            station_code=req.station_code,
            scheduled_hour=req.scheduled_hour,
            day_of_week=req.day_of_week,
            month=req.month,
            distance_km=req.distance_km,
            train_type=req.train_type or "Superfast",
            historical_avg_delay=req.historical_avg_delay or 15.0
        )

        return DelayPredictionResponse(
            train_number=req.train_number,
            station_code=req.station_code,
            predicted_delay_minutes=predicted_delay,
            confidence_score=confidence,
            delay_category=category,
            model_version="xgboost-v1" if not is_fallback else "domain-baseline-v1",
            features_used={
                "scheduled_hour": req.scheduled_hour,
                "day_of_week": req.day_of_week,
                "distance_km": req.distance_km,
                "train_type": req.train_type,
                "historical_avg_delay": req.historical_avg_delay
            },
            is_baseline_fallback=is_fallback,
            data_source="predicted"
        )
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Prediction service failure")

@router.post("/asset-risk", response_model=AssetRiskPredictionResponse)
async def predict_asset_risk(req: AssetRiskPredictionRequest):
    """Predicts asset failure probability and recommended maintenance window."""
    try:
        result = prediction_service.predict_asset_risk(
            asset_code=req.asset_code,
            asset_type=req.asset_type,
            utilization_rate=req.utilization_rate,
            days_since_maintenance=req.days_since_maintenance,
            health_score=req.health_score
        )
        return AssetRiskPredictionResponse(**result)
    except Exception as e:
        logger.error(f"Asset risk prediction error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Asset risk prediction service failure")
