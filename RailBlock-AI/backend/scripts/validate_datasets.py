import os
import json
import logging

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("validate")

def validate_datasets():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_dir = os.path.join(base_dir, "data", "raw", "indian_railways")
    processed_dir = os.path.join(base_dir, "data", "processed")

    logger.info("==========================================")
    logger.info("RailBlock AI - Dataset Validation")
    logger.info("==========================================")

    all_valid = True

    # 1. Check Trains dataset
    trains_file = os.path.join(raw_dir, "trains.json")
    if os.path.exists(trains_file):
        try:
            with open(trains_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            features = data.get("features", [])
            if len(features) > 0:
                p = features[0].get("properties", {})
                req_fields = ["number", "name", "from_station_code", "to_station_code"]
                missing = [f for f in req_fields if f not in p]
                if not missing:
                    logger.info(f"✓ Trains dataset valid: {len(features)} records, all required fields present.")
                else:
                    logger.warning(f"⚠ Trains dataset missing fields: {missing}")
            else:
                logger.error("✗ Trains dataset is empty.")
                all_valid = False
        except Exception as e:
            logger.error(f"✗ Failed to parse trains.json: {e}")
            all_valid = False
    else:
        logger.warning(f"⚠ Raw trains.json not found at {trains_file}")

    # 2. Check Stations dataset
    stations_file = os.path.join(raw_dir, "stations.json")
    if os.path.exists(stations_file):
        try:
            with open(stations_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            features = data.get("features", [])
            if len(features) > 0:
                p = features[0].get("properties", {})
                if "code" in p and "name" in p:
                    logger.info(f"✓ Stations dataset valid: {len(features)} stations, codes and names present.")
                else:
                    logger.warning("⚠ Stations dataset missing code/name properties.")
            else:
                logger.error("✗ Stations dataset is empty.")
                all_valid = False
        except Exception as e:
            logger.error(f"✗ Failed to parse stations.json: {e}")
            all_valid = False
    else:
        logger.warning(f"⚠ Raw stations.json not found at {stations_file}")

    # 3. Check Schedules dataset
    schedules_file = os.path.join(raw_dir, "schedules.json")
    if os.path.exists(schedules_file):
        try:
            size_mb = os.path.getsize(schedules_file) / (1024 * 1024)
            logger.info(f"✓ Schedules dataset exists: {size_mb:.2f} MB.")
        except Exception as e:
            logger.error(f"✗ Failed checking schedules.json: {e}")
            all_valid = False

    logger.info("==========================================")
    if all_valid:
        logger.info("RESULT: All dataset validation checks passed!")
    else:
        logger.info("RESULT: Some warnings or errors detected during validation.")
    logger.info("==========================================")
    return all_valid

if __name__ == "__main__":
    validate_datasets()
