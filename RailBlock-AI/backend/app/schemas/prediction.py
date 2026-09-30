from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from . import DataSourceMixin

class DelayPredictionRequest(BaseModel):
    train_number: str = Field(..., description="Train number e.g. 12301")
    station_code: str = Field(..., description="Station code e.g. NDLS")
    scheduled_hour: int = Field(default=10, ge=0, le=23)
    day_of_week: int = Field(default=2, ge=0, le=6)
    month: int = Field(default=9, ge=1, le=12)
    distance_km: float = Field(default=350.0, ge=0.0)
    train_type: Optional[str] = Field(default="Superfast")
    historical_avg_delay: Optional[float] = Field(default=15.0)

class DelayPredictionResponse(BaseModel):
    train_number: str
    station_code: str
    predicted_delay_minutes: float
    confidence_score: float
    delay_category: str # Minimal (<15m), Moderate (15-45m), Severe (>45m)
    model_version: str
    features_used: Dict[str, Any]
    is_baseline_fallback: bool
    data_source: str = "predicted"

class AssetRiskPredictionRequest(BaseModel):
    asset_code: str
    asset_type: str
    utilization_rate: float
    days_since_maintenance: int
    health_score: float

class AssetRiskPredictionResponse(BaseModel):
    asset_code: str
    failure_risk_probability: float
    recommended_maintenance_window_days: int
    recommended_action: str
    confidence_score: float
    data_source: str = "predicted"
