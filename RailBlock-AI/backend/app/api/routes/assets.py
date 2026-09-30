import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_

from app.db.database import get_db
from app.models.asset import Asset
from app.schemas.asset import AssetResponse, PaginatedAssetsResponse, AssetSummary

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("", response_model=PaginatedAssetsResponse)
@router.get("/", response_model=PaginatedAssetsResponse)
async def get_assets(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    asset_type: Optional[str] = None,
    asset_status: Optional[str] = None,
    zone: Optional[str] = None
):
    """Lists railway assets with filtering and summary KPIs."""
    query = select(Asset)

    if asset_type and asset_type != "ALL":
        query = query.where(Asset.asset_type.ilike(f"%{asset_type}%"))
    if asset_status and asset_status != "ALL":
        query = query.where(Asset.asset_status == asset_status)
    if zone and zone != "ALL":
        query = query.where(Asset.zone == zone)

    count_query = select(func.count()).select_from(query.subquery())
    total_res = await db.execute(count_query)
    total = total_res.scalar() or 0

    query = query.order_by(Asset.id).offset((page - 1) * size).limit(size)
    result = await db.execute(query)
    items = result.scalars().all()

    # Generate synthetic default items if DB not yet seeded
    if total == 0:
        demo_assets = [
            Asset(id=1, asset_code="WAP7-30201", asset_name="WAP-7 30201 (Ghaziabad Shed)", asset_type="Locomotive", asset_status="Available", home_depot="Ghaziabad Electric Loco Shed", zone="NR", track_section_code="NDLS-PWL", utilization_rate=82.5, health_score=94.0, data_source="simulated"),
            Asset(id=2, asset_code="WAP7-30245", asset_name="WAP-7 30245 (Tughlakabad Shed)", asset_type="Locomotive", asset_status="Available", home_depot="Tughlakabad Loco Shed", zone="NR", track_section_code="PWL-MTJ", utilization_rate=78.0, health_score=96.5, data_source="simulated"),
            Asset(id=3, asset_code="WAP5-30012", asset_name="WAP-5 30012 (Vadodara Shed)", asset_type="Locomotive", asset_status="In Use", home_depot="Vadodara Electric Loco Shed", zone="WR", track_section_code="MTJ-AGC", utilization_rate=91.0, health_score=88.0, data_source="simulated"),
            Asset(id=4, asset_code="WAG9-31089", asset_name="WAG-9 31089 Freight Heavy Haul", asset_type="Locomotive", asset_status="Available", home_depot="Ajni Electric Loco Shed", zone="CR", track_section_code="AGC-GWL", utilization_rate=65.0, health_score=92.0, data_source="simulated"),
            Asset(id=5, asset_code="LHB-AC1-0941", asset_name="LHB AC First Class Coach (24-Berth)", asset_type="Coach", asset_status="Available", home_depot="New Delhi Coaching Yard", zone="NR", track_section_code="NDLS-PWL", utilization_rate=84.0, health_score=98.0, data_source="simulated"),
            Asset(id=6, asset_code="LHB-AC2-1182", asset_name="LHB AC 2-Tier Coach", asset_type="Coach", asset_status="Available", home_depot="New Delhi Coaching Yard", zone="NR", track_section_code="NDLS-PWL", utilization_rate=86.0, health_score=95.0, data_source="simulated"),
            Asset(id=7, asset_code="LHB-AC3-2219", asset_name="LHB AC 3-Tier Coach", asset_type="Coach", asset_status="In Use", home_depot="Hazrat Nizamuddin Coaching Depot", zone="NR", track_section_code="PWL-MTJ", utilization_rate=92.0, health_score=91.0, data_source="simulated"),
            Asset(id=8, asset_code="TRK-NDLS-01", asset_name="Main Down Line Track Block Section 1", asset_type="Track", asset_status="Available", home_depot="Delhi Division P-Way", zone="NR", track_section_code="NDLS-PWL", utilization_rate=88.0, health_score=90.0, data_source="simulated"),
            Asset(id=9, asset_code="SIG-EI-MTJ", asset_name="Solid State Interlocking Unit MTJ-04", asset_type="Signalling Equipment", asset_status="Available", home_depot="Agra S&T Depot", zone="NCR", track_section_code="PWL-MTJ", utilization_rate=95.0, health_score=99.0, data_source="simulated"),
            Asset(id=10, asset_code="OHE-AGC-02", asset_name="25kV AC Traction Overhead Line AGC", asset_type="Track", asset_status="Under Maintenance", home_depot="Agra Cantt Traction Depot", zone="NCR", track_section_code="MTJ-AGC", utilization_rate=45.0, health_score=78.0, data_source="simulated")
        ]
        items = demo_assets
        total = len(demo_assets)

    summary = AssetSummary(
        total_assets=total,
        available_locomotives=412,
        total_locomotives=480,
        available_coaches=3150,
        total_coaches=3600,
        track_sections_operational=184,
        total_track_sections=198,
        signalling_operational=410,
        total_signalling=425,
        average_utilization_rate=82.4,
        average_health_score=93.6,
        data_source="simulated"
    )

    total_pages = max(1, (total + size - 1) // size)
    return PaginatedAssetsResponse(
        items=[AssetResponse.model_validate(a) for a in items],
        total=total,
        page=page,
        size=size,
        total_pages=total_pages,
        summary=summary
    )

@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset_by_id(asset_id: int, db: AsyncSession = Depends(get_db)):
    stmt = select(Asset).where(Asset.id == asset_id)
    res = await db.execute(stmt)
    asset = res.scalar_one_or_none()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return AssetResponse.model_validate(asset)
