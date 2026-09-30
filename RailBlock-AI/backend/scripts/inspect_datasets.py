import os
import json
import logging
from typing import Dict, Any

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("inspect")

def inspect_json_features(filepath: str, name: str):
    logger.info(f"\n==========================================")
    logger.info(f"Dataset: {name}")
    logger.info(f"Path: {filepath}")
    logger.info(f"==========================================")

    if not os.path.exists(filepath):
        logger.warning(f"File not found: {filepath}")
        return

    size_mb = os.path.getsize(filepath) / (1024 * 1024)
    logger.info(f"File Size: {size_mb:.2f} MB")

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        if isinstance(data, dict) and "features" in data:
            features = data["features"]
            logger.info(f"Format: GeoJSON FeatureCollection")
            logger.info(f"Total Records: {len(features)}")
            if features:
                sample_props = features[0].get("properties", {})
                logger.info(f"Property Columns ({len(sample_props)}):")
                for k, v in sample_props.items():
                    logger.info(f"  - {k} (type: {type(v).__name__}, sample: {v})")
        elif isinstance(data, list):
            logger.info(f"Format: JSON Array")
            logger.info(f"Total Records: {len(data)}")
            if data:
                sample = data[0]
                logger.info(f"Columns ({len(sample)}):")
                for k, v in sample.items():
                    logger.info(f"  - {k} (type: {type(v).__name__}, sample: {v})")
        else:
            logger.info(f"JSON Object with keys: {list(data.keys())[:10]}")
    except Exception as e:
        logger.error(f"Error reading {filepath}: {e}")

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_dir = os.path.join(base_dir, "data", "raw", "indian_railways")

    inspect_json_features(os.path.join(raw_dir, "trains.json"), "Indian Railways Trains Dataset (Kaggle)")
    inspect_json_features(os.path.join(raw_dir, "stations.json"), "Indian Railways Stations Dataset (Kaggle)")
    inspect_json_features(os.path.join(raw_dir, "schedules.json"), "Indian Railways Schedules Dataset (Kaggle)")

if __name__ == "__main__":
    main()
