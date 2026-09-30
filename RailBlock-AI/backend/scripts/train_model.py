import os
import json
import logging
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import xgboost as xgb

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("train_model")

def build_training_dataset():
    """
    Constructs a supervised training dataset for train delays
    using route characteristics, distances, time-of-day, and simulated delay observations.
    """
    np.random.seed(42)
    n_samples = 15000

    # Feature distributions
    scheduled_hour = np.random.randint(0, 24, size=n_samples)
    day_of_week = np.random.randint(0, 7, size=n_samples)
    month = np.random.randint(1, 13, size=n_samples)
    distance_km = np.random.uniform(50.0, 2500.0, size=n_samples)
    # 0 = Premium (Rajdhani/Vande Bharat/Shatabdi), 1 = Regular Superfast/Mail, 2 = Freight
    train_type_code = np.random.choice([0, 1, 2], p=[0.25, 0.60, 0.15], size=n_samples)
    historical_avg_delay = np.random.uniform(5.0, 30.0, size=n_samples)

    # Domain delay equation + stochastic component:
    # - Peak hours (8-11 and 17-21) add delay
    is_peak = ((scheduled_hour >= 8) & (scheduled_hour <= 11)) | ((scheduled_hour >= 17) & (scheduled_hour <= 21))
    peak_delay = np.where(is_peak, np.random.uniform(8.0, 22.0, size=n_samples), np.random.uniform(0.0, 5.0, size=n_samples))

    # Distance accumulation: ~2.5 mins per 250 km
    dist_delay = (distance_km / 250.0) * 2.5

    # Type multiplier
    type_mult = np.where(train_type_code == 0, 0.4, np.where(train_type_code == 1, 0.9, 1.6))

    # Target: delay_minutes
    noise = np.random.normal(0, 3.5, size=n_samples)
    delay_minutes = (historical_avg_delay * 0.4 + peak_delay + dist_delay) * type_mult + noise
    delay_minutes = np.maximum(0.0, np.round(delay_minutes, 1))

    df = pd.DataFrame({
        "scheduled_hour": scheduled_hour,
        "day_of_week": day_of_week,
        "month": month,
        "distance_km": distance_km,
        "train_type_code": train_type_code,
        "historical_avg_delay": historical_avg_delay,
        "delay_minutes": delay_minutes
    })
    return df

def train_and_evaluate():
    logger.info("Building supervised train delay dataset...")
    df = build_training_dataset()

    feature_cols = [
        "scheduled_hour",
        "day_of_week",
        "month",
        "distance_km",
        "train_type_code",
        "historical_avg_delay"
    ]
    target_col = "delay_minutes"

    X = df[feature_cols]
    y = df[target_col]

    # Train / Test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    logger.info(f"Training XGBoost Regressor on {len(X_train)} samples...")
    model = xgb.XGBRegressor(
        n_estimators=120,
        learning_rate=0.08,
        max_depth=5,
        subsample=0.85,
        colsample_bytree=0.85,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Evaluation
    preds = model.predict(X_test)
    preds = np.maximum(0.0, preds)

    mae = float(mean_absolute_error(y_test, preds))
    rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
    r2 = float(r2_score(y_test, preds))

    logger.info("\n================ Model Evaluation ================")
    logger.info(f"Mean Absolute Error (MAE): {mae:.2f} minutes")
    logger.info(f"Root Mean Squared Error (RMSE): {rmse:.2f} minutes")
    logger.info(f"R² Score: {r2:.4f}")
    logger.info("===================================================\n")

    # Save model and metadata
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(base_dir, "ml_models", "delay_model")
    os.makedirs(out_dir, exist_ok=True)

    model_path = os.path.join(out_dir, "train_delay_model.joblib")
    joblib.dump(model, model_path)

    metadata = {
        "model_name": "Indian Railways Train Delay Predictor",
        "algorithm": "XGBoost Regressor",
        "features": feature_cols,
        "target": target_col,
        "metrics": {
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "r2": round(r2, 4)
        },
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "random_state": 42
    }

    with open(os.path.join(out_dir, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    logger.info(f"Model saved successfully to {model_path}")
    logger.info(f"Metadata saved to {os.path.join(out_dir, 'metadata.json')}")

if __name__ == "__main__":
    train_and_evaluate()
