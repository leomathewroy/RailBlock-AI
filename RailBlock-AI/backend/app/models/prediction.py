from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime, timezone
from app.db.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    target_entity_type = Column(String(32), index=True, nullable=False) # train, asset, track_section
    target_entity_id = Column(String(64), index=True, nullable=False)
    prediction_type = Column(String(64), index=True, nullable=False) # delay_minutes, asset_failure_risk, track_congestion
    predicted_value = Column(Float, nullable=False)
    confidence_score = Column(Float, default=0.85)
    features_used_json = Column(Text, nullable=True)
    model_version = Column(String(64), default="xgboost-v1")
    data_source = Column(String(32), default="predicted")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
