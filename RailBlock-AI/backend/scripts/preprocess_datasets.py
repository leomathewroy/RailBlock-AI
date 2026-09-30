import os
import json
import logging
from typing import Dict, Any, List

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("preprocess")

def clean_trains(raw_path: str, out_path: str) -> int:
    logger.info(f"Cleaning trains dataset from {raw_path}...")
    if not os.path.exists(raw_path):
        logger.warning(f"Raw trains file not found at {raw_path}")
        return 0

    with open(raw_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    cleaned = []
    features = data.get("features", [])
    for feat in features:
        props = feat.get("properties", {})
        num = props.get("number")
        name = props.get("name")
        if not num or not name:
            continue

        cleaned.append({
            "train_number": str(num).strip(),
            "train_name": str(name).strip(),
            "train_type": props.get("type", "Express"),
            "zone": props.get("zone", "NR"),
            "from_station_code": props.get("from_station_code"),
            "from_station_name": props.get("from_station_name"),
            "to_station_code": props.get("to_station_code"),
            "to_station_name": props.get("to_station_name"),
            "departure_time": props.get("departure"),
            "arrival_time": props.get("arrival"),
            "duration_h": props.get("duration_h", 0),
            "duration_m": props.get("duration_m", 0),
            "distance_km": float(props.get("distance", 0.0) or 0.0),
            "classes": props.get("classes", ""),
            "data_source": "public_dataset"
        })

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=2)

    logger.info(f"Retained {len(cleaned)} cleaned train records out of {len(features)}. Saved to {out_path}")
    return len(cleaned)

def clean_stations(raw_path: str, out_path: str) -> int:
    logger.info(f"Cleaning stations dataset from {raw_path}...")
    if not os.path.exists(raw_path):
        logger.warning(f"Raw stations file not found at {raw_path}")
        return 0

    with open(raw_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    cleaned = []
    features = data.get("features", [])
    seen_codes = set()

    for feat in features:
        props = feat.get("properties", {})
        code = props.get("code")
        name = props.get("name")
        if not code or not name or code in seen_codes:
            continue

        # Extract coordinates if available
        geom = feat.get("geometry") or {}
        coords = geom.get("coordinates") if isinstance(geom, dict) else None
        lng = coords[0] if coords and len(coords) >= 2 else None
        lat = coords[1] if coords and len(coords) >= 2 else None

        seen_codes.add(code)
        cleaned.append({
            "station_code": str(code).strip(),
            "station_name": str(name).strip(),
            "zone": props.get("zone"),
            "state": props.get("state"),
            "address": props.get("address"),
            "location_lat": lat,
            "location_lng": lng,
            "data_source": "public_dataset"
        })

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=2)

    logger.info(f"Retained {len(cleaned)} cleaned station records out of {len(features)}. Saved to {out_path}")
    return len(cleaned)

def clean_schedules_sample(raw_path: str, out_path: str, max_records: int = 50000) -> int:
    logger.info(f"Processing schedules sample (up to {max_records} records) from {raw_path}...")
    if not os.path.exists(raw_path):
        logger.warning(f"Raw schedules file not found at {raw_path}")
        return 0

    cleaned = []
    with open(raw_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for item in data[:max_records]:
        num = item.get("train_number")
        stn = item.get("station_code")
        if not num or not stn:
            continue

        cleaned.append({
            "train_number": str(num).strip(),
            "train_name": item.get("train_name"),
            "station_code": str(stn).strip(),
            "station_name": item.get("station_name"),
            "arrival_time": None if item.get("arrival") == "None" else item.get("arrival"),
            "departure_time": None if item.get("departure") == "None" else item.get("departure"),
            "day": item.get("day", 1),
            "data_source": "public_dataset"
        })

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=2)

    logger.info(f"Saved {len(cleaned)} cleaned schedule sample records to {out_path}")
    return len(cleaned)

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    raw_dir = os.path.join(base_dir, "data", "raw", "indian_railways")
    proc_dir = os.path.join(base_dir, "data", "processed")

    clean_trains(os.path.join(raw_dir, "trains.json"), os.path.join(proc_dir, "cleaned_trains.json"))
    clean_stations(os.path.join(raw_dir, "stations.json"), os.path.join(proc_dir, "cleaned_stations.json"))
    clean_schedules_sample(os.path.join(raw_dir, "schedules.json"), os.path.join(proc_dir, "cleaned_schedules.json"))
    logger.info("All raw datasets cleaned and preprocessed successfully.")

if __name__ == "__main__":
    main()
