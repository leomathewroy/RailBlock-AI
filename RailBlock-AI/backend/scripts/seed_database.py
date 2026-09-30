import os
import sys
import json
import asyncio
import logging

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select, func
from app.db.database import async_session_maker, init_db
from app.core.config import settings
from app.core.security import get_password_hash
from app.models.user import User
from app.models.train import Train, Station, TrackSection
from app.models.asset import Asset
from app.models.maintenance import MaintenanceRequest, MaintenanceBlock
from app.models.block_plan import BlockPlan, BlockPlanItem

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("seed")

async def seed_all():
    logger.info("Initializing database tables...")
    await init_db()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    proc_dir = os.path.join(base_dir, "data", "processed")
    synth_dir = os.path.join(base_dir, "data", "synthetic")
    raw_dir = os.path.join(base_dir, "data", "raw", "indian_railways")

    async with async_session_maker() as session:
        # 1. Seed Users (Idempotent)
        logger.info("Checking users...")
        demo_stmt = select(User).where(User.username == settings.DEMO_USERNAME)
        res = await session.execute(demo_stmt)
        demo_user = res.scalar_one_or_none()
        if not demo_user:
            demo_user = User(
                username=settings.DEMO_USERNAME,
                email="controller.nr@railways.gov.in.demo",
                hashed_password=get_password_hash(settings.DEMO_PASSWORD),
                full_name="Chief Operations Controller",
                role="admin",
                is_active=True
            )
            session.add(demo_user)
            logger.info(f"Created demo user: {settings.DEMO_USERNAME}")

        # 2. Seed Stations (Sample from cleaned or raw)
        logger.info("Checking stations...")
        stn_cnt = (await session.execute(select(func.count(Station.id)))).scalar()
        if stn_cnt == 0:
            stn_source = os.path.join(proc_dir, "cleaned_stations.json")
            if not os.path.exists(stn_source):
                stn_source = os.path.join(raw_dir, "stations.json")
            
            if os.path.exists(stn_source):
                with open(stn_source, "r", encoding="utf-8") as f:
                    stn_data = json.load(f)
                
                # If geojson
                items = stn_data.get("features", []) if isinstance(stn_data, dict) else stn_data
                to_add = []
                seen_codes = set()
                for item in items[:250]: # Seed top 250 stations for performance
                    props = item.get("properties", item) if isinstance(item, dict) else {}
                    code = props.get("code") or props.get("station_code")
                    name = props.get("name") or props.get("station_name")
                    if code and name and code not in seen_codes:
                        seen_codes.add(code)
                        to_add.append(Station(
                            station_code=str(code).strip(),
                            station_name=str(name).strip(),
                            zone=props.get("zone"),
                            state=props.get("state"),
                            address=props.get("address"),
                            location_lat=props.get("location_lat"),
                            location_lng=props.get("location_lng"),
                            data_source="public_dataset"
                        ))
                session.add_all(to_add)
                logger.info(f"Seeded {len(to_add)} stations from dataset.")

        # 3. Seed Trains
        logger.info("Checking trains...")
        trn_cnt = (await session.execute(select(func.count(Train.id)))).scalar()
        if trn_cnt == 0:
            trn_source = os.path.join(proc_dir, "cleaned_trains.json")
            if not os.path.exists(trn_source):
                trn_source = os.path.join(raw_dir, "trains.json")
            
            if os.path.exists(trn_source):
                with open(trn_source, "r", encoding="utf-8") as f:
                    trn_data = json.load(f)
                
                items = trn_data.get("features", []) if isinstance(trn_data, dict) else trn_data
                to_add = []
                seen_nums = set()
                for item in items[:150]: # Seed top 150 trains
                    props = item.get("properties", item) if isinstance(item, dict) else {}
                    num = props.get("number") or props.get("train_number")
                    name = props.get("name") or props.get("train_name")
                    if num and name and num not in seen_nums:
                        seen_nums.add(num)
                        to_add.append(Train(
                            train_number=str(num).strip(),
                            train_name=str(name).strip(),
                            train_type=props.get("type") or props.get("train_type") or "Superfast",
                            zone=props.get("zone", "NR"),
                            from_station_code=props.get("from_station_code"),
                            from_station_name=props.get("from_station_name"),
                            to_station_code=props.get("to_station_code"),
                            to_station_name=props.get("to_station_name"),
                            departure_time=props.get("departure") or props.get("departure_time"),
                            arrival_time=props.get("arrival") or props.get("arrival_time"),
                            duration_h=int(props.get("duration_h", 0) or 0),
                            duration_m=int(props.get("duration_m", 0) or 0),
                            distance_km=float(props.get("distance", 0.0) or props.get("distance_km", 0.0) or 0.0),
                            data_source="public_dataset"
                        ))
                session.add_all(to_add)
                logger.info(f"Seeded {len(to_add)} trains from dataset.")

        # 4. Seed Track Sections
        logger.info("Checking track sections...")
        sec_cnt = (await session.execute(select(func.count(TrackSection.id)))).scalar()
        if sec_cnt == 0:
            synth_sec_file = os.path.join(synth_dir, "synthetic_track_sections.json")
            if os.path.exists(synth_sec_file):
                with open(synth_sec_file, "r", encoding="utf-8") as f:
                    secs = json.load(f)
                to_add = [TrackSection(**s) for s in secs]
                session.add_all(to_add)
                logger.info(f"Seeded {len(to_add)} track sections.")

        # 5. Seed Assets
        logger.info("Checking assets...")
        ast_cnt = (await session.execute(select(func.count(Asset.id)))).scalar()
        if ast_cnt == 0:
            synth_ast_file = os.path.join(synth_dir, "synthetic_assets.json")
            if os.path.exists(synth_ast_file):
                with open(synth_ast_file, "r", encoding="utf-8") as f:
                    asts = json.load(f)
                to_add = [Asset(**a) for a in asts]
                session.add_all(to_add)
                logger.info(f"Seeded {len(to_add)} assets.")

        # 6. Seed Maintenance Requests
        logger.info("Checking maintenance requests...")
        req_cnt = (await session.execute(select(func.count(MaintenanceRequest.id)))).scalar()
        if req_cnt == 0:
            synth_req_file = os.path.join(synth_dir, "synthetic_maintenance_requests.json")
            if os.path.exists(synth_req_file):
                with open(synth_req_file, "r", encoding="utf-8") as f:
                    reqs = json.load(f)
                to_add = []
                for r in reqs:
                    r_copy = r.copy()
                    r_copy.pop("deadline", None)
                    to_add.append(MaintenanceRequest(**r_copy))
                session.add_all(to_add)
                logger.info(f"Seeded {len(to_add)} maintenance requests.")

        await session.commit()
        logger.info("Database seeding completed successfully!")

def main():
    asyncio.run(seed_all())

if __name__ == "__main__":
    main()
