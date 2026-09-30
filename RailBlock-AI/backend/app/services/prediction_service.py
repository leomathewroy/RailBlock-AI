import os
import joblib
import logging
import numpy as np
from typing import Dict, Any, Optional, Tuple
from app.core.config import settings

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self, model_dir: Optional[str] = None):
        self.model_dir = model_dir or settings.MODEL_PATH
        self.model = None
        self.metadata = {}
        self.is_trained = False
        self._load_model()

    def _load_model(self):
        """Attempt to load trained XGBoost/Scikit-learn model."""
        model_file = os.path.join(self.model_dir, "train_delay_model.joblib")
        metadata_file = os.path.join(self.model_dir, "metadata.json")
        if os.path.exists(model_file):
            try:
                self.model = joblib.load(model_file)
                self.is_trained = True
                logger.info(f"Loaded trained delay prediction model from {model_file}")
            except Exception as e:
                logger.warning(f"Failed to load model from {model_file}: {e}. Baseline fallback active.")
                self.is_trained = False
        else:
            logger.info("No saved delay model artifact found. Using deterministic baseline calculation.")
            self.is_trained = False

    def predict_delay(
        self,
        train_number: str,
        station_code: str,
        scheduled_hour: int,
        day_of_week: int,
        month: int,
        distance_km: float,
        train_type: str = "Superfast",
        historical_avg_delay: float = 15.0
    ) -> Tuple[float, float, str, bool]:
        """
        Predicts train delay in minutes.
        Returns: (predicted_delay_minutes, confidence_score, delay_category, is_baseline_fallback)
        """
        features_dict = {
            "scheduled_hour": scheduled_hour,
            "day_of_week": day_of_week,
            "month": month,
            "distance_km": distance_km,
            "historical_avg_delay": historical_avg_delay
        }

        # If trained ML model is available, use it
        if self.is_trained and self.model is not None:
            try:
                # Features vector
                type_code = 0 if "Superfast" in train_type or "Rajdhani" in train_type or "Vande" in train_type else 1
                X = np.array([[scheduled_hour, day_of_week, month, distance_km, type_code, historical_avg_delay]])
                predicted = float(self.model.predict(X)[0])
                predicted = max(0.0, round(predicted, 1))
                confidence = 0.88
                is_fallback = False
            except Exception as e:
                logger.warning(f"Model prediction inference failed: {e}. Falling back to baseline.")
                predicted, confidence, is_fallback = self._baseline_prediction(
                    scheduled_hour, day_of_week, distance_km, train_type, historical_avg_delay
                )
        else:
            # Deterministic baseline calculation based on Indian Railways delay patterns
            predicted, confidence, is_fallback = self._baseline_prediction(
                scheduled_hour, day_of_week, distance_km, train_type, historical_avg_delay
            )

        # Categorize
        if predicted < 15.0:
            category = "Minimal (<15m)"
        elif predicted <= 45.0:
            category = "Moderate (15-45m)"
        else:
            category = "Severe (>45m)"

        return predicted, confidence, category, is_fallback

    def _baseline_prediction(
        self,
        scheduled_hour: int,
        day_of_week: int,
        distance_km: float,
        train_type: str,
        historical_avg: float
    ) -> Tuple[float, float, bool]:
        """
        Deterministic, domain-aware baseline calculation:
        - Peak traffic hours (08:00-11:00 and 17:00-21:00) increase congestion
        - High distance trains accumulate cascading delays
        - Premium trains (Rajdhani, Vande Bharat, Shatabdi) get signaling priority
        """
        base = historical_avg if historical_avg > 0 else 12.0

        # Peak hour factor
        if (8 <= scheduled_hour <= 11) or (17 <= scheduled_hour <= 21):
            time_factor = 1.35
        elif 1 <= scheduled_hour <= 5:
            time_factor = 0.75 # Night off-peak
        else:
            time_factor = 1.0

        # Weekend / weekday variation
        day_factor = 1.15 if day_of_week in (4, 5, 6) else 0.95

        # Distance factor (approx 3 min delay per 200 km traversed)
        dist_factor = (distance_km / 200.0) * 2.8

        # Priority factor
        train_type_lower = train_type.lower()
        if "rajdhani" in train_type_lower or "vande" in train_type_lower or "shatabdi" in train_type_lower:
            priority_mult = 0.45
        elif "superfast" in train_type_lower or "express" in train_type_lower:
            priority_mult = 0.85
        elif "freight" in train_type_lower:
            priority_mult = 1.6
        else:
            priority_mult = 1.0

        delay = (base * time_factor * day_factor + dist_factor) * priority_mult
        delay = max(0.0, round(delay, 1))
        return delay, 0.78, True

    def predict_asset_risk(
        self,
        asset_code: str,
        asset_type: str,
        utilization_rate: float,
        days_since_maintenance: int,
        health_score: float
    ) -> Dict[str, Any]:
        """Predicts operational risk and maintenance urgency for a rolling stock or track asset."""
        # Risk probability combines utilization and wear
        wear_factor = min(1.0, days_since_maintenance / 60.0)
        util_factor = utilization_rate / 100.0
        health_penalty = (100.0 - health_score) / 100.0

        risk = 0.2 * util_factor + 0.4 * wear_factor + 0.4 * health_penalty
        risk = max(0.02, min(0.98, round(risk, 2)))

        if risk > 0.7:
            action = "Immediate Preventive Block Required"
            window = 2
        elif risk > 0.4:
            action = "Schedule Maintenance in Next 7 Days"
            window = 7
        else:
            action = "Normal Operational Cycle"
            window = 30

        return {
            "asset_code": asset_code,
            "failure_risk_probability": risk,
            "recommended_maintenance_window_days": window,
            "recommended_action": action,
            "confidence_score": 0.84,
            "data_source": "predicted"
        }

prediction_service = PredictionService()
