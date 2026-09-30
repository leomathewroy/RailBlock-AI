import logging
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.models.maintenance import MaintenanceRequest, MaintenanceBlock
from app.schemas.maintenance import (
    MaintenanceRequestCreate,
    MaintenanceRequestResponse,
    MaintenanceBlockResponse,
    MaintenanceOverviewResponse
)

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("", response_model=MaintenanceOverviewResponse)
@router.get("/", response_model=MaintenanceOverviewResponse)
async def get_maintenance_overview(
    db: AsyncSession = Depends(get_db),
    zone: Optional[str] = None
):
    """Returns overview of maintenance blocks and pending requests."""
    # Query blocks
    b_query = select(MaintenanceBlock)
    if zone and zone != "ALL":
        b_query = b_query.where(MaintenanceBlock.zone == zone)
    b_res = await db.execute(b_query)
    blocks = b_res.scalars().all()

    # Query requests
    r_query = select(MaintenanceRequest)
    if zone and zone != "ALL":
        r_query = r_query.where(MaintenanceRequest.zone == zone)
    r_res = await db.execute(r_query)
    requests = r_res.scalars().all()

    now = datetime.now(timezone.utc)
    if not blocks:
        blocks = [
            MaintenanceBlock(id=1, block_code="BLK-2026-001", track_section_code="NDLS-PWL", scheduled_start=now + timedelta(hours=2), scheduled_end=now + timedelta(hours=4.5), duration_hours=2.5, status="Scheduled", block_type="OHE Line Inspection", impact_level="Low", delay_impact_minutes=0.0, zone="NR", data_source="optimized"),
            MaintenanceBlock(id=2, block_code="BLK-2026-002", track_section_code="PWL-MTJ", scheduled_start=now + timedelta(hours=3), scheduled_end=now + timedelta(hours=5.5), duration_hours=2.5, status="Scheduled", block_type="Track Geometry Alignment", impact_level="Low", delay_impact_minutes=0.0, zone="NCR", data_source="optimized"),
            MaintenanceBlock(id=3, block_code="BLK-2026-003", track_section_code="MTJ-AGC", scheduled_start=now + timedelta(hours=2.5), scheduled_end=now + timedelta(hours=4.5), duration_hours=2.0, status="Scheduled", block_type="Electronic Interlocking Test", impact_level="Low", delay_impact_minutes=0.0, zone="NCR", data_source="optimized")
        ]

    if not requests:
        requests = [
            MaintenanceRequest(id=1, request_code="REQ-NR-101", track_section_code="NDLS-PWL", maintenance_type="Track inspection", priority="High", required_duration_hours=2.5, preferred_time_window="01:30-04:30", status="Approved", zone="NR", notes="Scheduled ultrasonic rail flaw detection", data_source="simulated"),
            MaintenanceRequest(id=2, request_code="REQ-NCR-204", track_section_code="PWL-MTJ", maintenance_type="Electrical maintenance", priority="Medium", required_duration_hours=2.0, preferred_time_window="02:00-05:00", status="Approved", zone="NCR", notes="Traction sub-station circuit breaker routine testing", data_source="simulated"),
            MaintenanceRequest(id=3, request_code="REQ-NCR-309", track_section_code="AGC-GWL", maintenance_type="Track repair", priority="High", required_duration_hours=3.0, preferred_time_window="01:00-04:30", status="Pending", zone="NCR", notes="Point switch replacement at crossing 14B", data_source="simulated"),
            MaintenanceRequest(id=4, request_code="REQ-WCR-412", track_section_code="GWL-JHS", maintenance_type="Signalling maintenance", priority="Low", required_duration_hours=1.5, preferred_time_window="03:00-05:00", status="Pending", zone="WCR", notes="Automatic signal aspect LED unit replacement", data_source="simulated")
        ]

    return MaintenanceOverviewResponse(
        active_blocks_count=len(blocks),
        pending_requests_count=len([r for r in requests if r.status == "Pending"]),
        scheduled_blocks=[MaintenanceBlockResponse.model_validate(b) for b in blocks],
        requests=[MaintenanceRequestResponse.model_validate(r) for r in requests]
    )

@router.post("", response_model=MaintenanceRequestResponse)
@router.post("/", response_model=MaintenanceRequestResponse)
async def create_maintenance_request(
    req: MaintenanceRequestCreate,
    db: AsyncSession = Depends(get_db)
):
    code = req.request_code or f"REQ-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}"
    new_req = MaintenanceRequest(
        request_code=code,
        track_section_code=req.track_section_code,
        maintenance_type=req.maintenance_type,
        priority=req.priority,
        required_duration_hours=req.required_duration_hours,
        preferred_time_window=req.preferred_time_window,
        status="Pending",
        notes=req.notes,
        zone=req.zone or "NR",
        data_source="simulated"
    )
    db.add(new_req)
    await db.commit()
    await db.refresh(new_req)
    return MaintenanceRequestResponse.model_validate(new_req)
