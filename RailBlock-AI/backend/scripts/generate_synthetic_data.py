import os
import json
import random
import logging
from datetime import datetime, timedelta, timezone

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("synthetic")

def generate_synthetic_data():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_dir = os.path.join(base_dir, "data", "synthetic")
    os.makedirs(out_dir, exist_ok=True)

    random.seed(42)

    # 1. Track Sections along major high-density corridors
    corridors = [
        # Delhi - Mumbai (WR/WCR/NCR/NR)
        ("NDLS-PWL", "New Delhi - Palwal", "NR", "NDLS", "PWL", 58.0, 3, True),
        ("PWL-MTJ", "Palwal - Mathura", "NCR", "PWL", "MTJ", 84.0, 2, True),
        ("MTJ-AGC", "Mathura - Agra Cantt", "NCR", "MTJ", "AGC", 54.0, 2, True),
        ("AGC-GWL", "Agra Cantt - Gwalior", "NCR", "AGC", "GWL", 118.0, 2, True),
        ("GWL-JHS", "Gwalior - Jhansi", "NCR", "GWL", "JHS", 98.0, 2, True),
        ("JHS-BPL", "Jhansi - Bhopal", "WCR", "JHS", "BPL", 292.0, 2, True),
        ("BPL-ET", "Bhopal - Itarsi", "WCR", "BPL", "ET", 92.0, 2, True),
        ("ET-KNW", "Itarsi - Khandwa", "WCR", "ET", "KNW", 183.0, 2, True),
        ("KNW-BSL", "Khandwa - Bhusaval", "CR", "KNW", "BSL", 124.0, 2, True),
        ("BSL-MMR", "Bhusaval - Manmad", "CR", "BSL", "MMR", 184.0, 2, True),
        ("MMR-KYN", "Manmad - Kalyan", "CR", "MMR", "KYN", 205.0, 2, True),
        ("KYN-CSMT", "Kalyan - Mumbai CSMT", "CR", "KYN", "CSMT", 54.0, 4, True),
        # Delhi - Howrah (NR/NCR/ECR/ER)
        ("NDLS-CNB", "New Delhi - Kanpur Central", "NCR", "NDLS", "CNB", 440.0, 2, True),
        ("CNB-PRYJ", "Kanpur - Prayagraj", "NCR", "CNB", "PRYJ", 194.0, 2, True),
        ("PRYJ-DDU", "Prayagraj - Pt. Deen Dayal Upadhyay", "ECR", "PRYJ", "DDU", 153.0, 2, True),
        ("DDU-GAYA", "Pt. Deen Dayal Upadhyay - Gaya", "ECR", "DDU", "GAYA", 205.0, 2, True),
        ("GAYA-DHN", "Gaya - Dhanbad", "ECR", "GAYA", "DHN", 200.0, 2, True),
        ("DHN-ASN", "Dhanbad - Asansol", "ER", "DHN", "ASN", 58.0, 2, True),
        ("ASN-HWH", "Asansol - Howrah", "ER", "ASN", "HWH", 200.0, 3, True),
    ]

    track_sections = []
    for i, (code, name, zone, start_stn, end_stn, length, cap, elec) in enumerate(corridors, start=1):
        maint_req = (i % 3 == 0) # Every 3rd section needs maintenance
        status = "Restricted" if (i % 7 == 0) else "Operational"
        track_sections.append({
            "section_code": code,
            "section_name": name,
            "zone": zone,
            "start_station_code": start_stn,
            "end_station_code": end_stn,
            "length_km": length,
            "capacity": cap,
            "electrified": elec,
            "maintenance_required": maint_req,
            "availability_status": status,
            "data_source": "simulated"
        })

    # 2. Rolling Stock & Assets
    asset_types = [
        ("Locomotive", "WAP-7", ["Ghaziabad", "Tughlakabad", "Vadodara", "Howrah", "Lallaguda"], 85.0),
        ("Locomotive", "WAP-5", ["Ghaziabad", "Vadodara"], 80.0),
        ("Locomotive", "WAG-9", ["Ajni", "Bhusaval", "Tatanagar", "Gomoh"], 75.0),
        ("Coach", "LHB AC 1-Tier", ["New Delhi", "Mumbai", "Howrah"], 90.0),
        ("Coach", "LHB AC 2-Tier", ["New Delhi", "Mumbai", "Howrah", "Chennai"], 92.0),
        ("Coach", "LHB AC 3-Tier", ["New Delhi", "Mumbai", "Howrah", "Secunderabad"], 94.0),
        ("Coach", "LHB Sleeper", ["Delhi", "Patna", "Gorakhpur", "Howrah"], 88.0),
        ("Track", "Continuous Welded Rail (60kg)", ["Delhi Division", "Agra Division"], 82.0),
        ("Signalling Equipment", "Electronic Interlocking Unit", ["Agra Division", "Jhansi Division"], 96.0)
    ]

    assets = []
    asset_counter = 1
    for a_type, sub_name, sheds, base_util in asset_types:
        num_copies = 8 if a_type == "Locomotive" else (12 if a_type == "Coach" else 5)
        for c in range(1, num_copies + 1):
            shed = random.choice(sheds)
            status_choice = random.choices(["Available", "In Use", "Under Maintenance"], weights=[0.75, 0.20, 0.05])[0]
            util = max(50.0, min(99.0, base_util + random.uniform(-10.0, 6.0)))
            health = max(70.0, min(100.0, 95.0 - (100.0 - util) * 0.2 + random.uniform(-5.0, 4.0)))

            assets.append({
                "asset_code": f"{sub_name[:4].replace('-', '')}-{asset_counter:04d}",
                "asset_name": f"{sub_name} (Unit #{asset_counter})",
                "asset_type": a_type,
                "asset_status": status_choice,
                "home_depot": f"{shed} Depot",
                "zone": "NR" if "Delhi" in shed or "Ghaziabad" in shed else ("WR" if "Vadodara" in shed or "Mumbai" in shed else "NCR"),
                "track_section_code": random.choice(corridors)[0],
                "utilization_rate": round(util, 1),
                "health_score": round(health, 1),
                "data_source": "simulated"
            })
            asset_counter += 1

    # 3. Maintenance Requests
    maint_types = [
        ("Track inspection", "Ultrasonic Flaw Detection (USFD)", 2.5, "High"),
        ("Electrical maintenance", "25kV AC OHE Contact Wire Inspection", 2.0, "Medium"),
        ("Track repair", "Turnout & Crossing Reconditioning", 3.0, "High"),
        ("Signalling maintenance", "Point Machine & Track Circuit Calibration", 2.0, "Low"),
        ("Routine inspection", "Ballast Screening and Tamping Machine Run", 3.5, "Medium")
    ]

    maintenance_requests = []
    now = datetime.now(timezone.utc)
    for i in range(1, 25):
        m_type, desc, dur, priority = random.choice(maint_types)
        sec = random.choice(corridors)
        status = random.choices(["Approved", "Pending", "Scheduled"], weights=[0.4, 0.4, 0.2])[0]
        maintenance_requests.append({
            "request_code": f"REQ-{sec[2]}-{202600 + i}",
            "track_section_code": sec[0],
            "maintenance_type": m_type,
            "priority": priority,
            "required_duration_hours": dur,
            "preferred_time_window": "01:30-05:00",
            "deadline": (now + timedelta(days=random.randint(2, 10))).isoformat(),
            "status": status,
            "notes": f"Simulated operational request for {desc} on {sec[1]}",
            "zone": sec[2],
            "data_source": "simulated"
        })

    # Save all
    with open(os.path.join(out_dir, "synthetic_track_sections.json"), "w", encoding="utf-8") as f:
        json.dump(track_sections, f, indent=2)

    with open(os.path.join(out_dir, "synthetic_assets.json"), "w", encoding="utf-8") as f:
        json.dump(assets, f, indent=2)

    with open(os.path.join(out_dir, "synthetic_maintenance_requests.json"), "w", encoding="utf-8") as f:
        json.dump(maintenance_requests, f, indent=2)

    logger.info(f"Generated synthetic operational datasets successfully:")
    logger.info(f"  - Track sections: {len(track_sections)}")
    logger.info(f"  - Assets: {len(assets)}")
    logger.info(f"  - Maintenance requests: {len(maintenance_requests)}")

if __name__ == "__main__":
    generate_synthetic_data()
