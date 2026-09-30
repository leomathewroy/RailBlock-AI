from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from . import DataSourceMixin

class MaintenanceRequestBase(BaseModel):
    request_code: Optional[str] = None
    track_section_code: str
    maintenance_type: str # Track inspection, Track repair, Electrical maintenance, Signalling maintenance, Routine inspection
    priority: str = "Medium" # High, Medium, Low
    required_duration_hours: float = 2.0
    preferred_time_window: str = "02:00-06:00"
    deadline: Optional[datetime] = None
    status: str = "Pending"
    notes: Optional[str] = None
    zone: Optional[str] = None

class MaintenanceRequestCreate(MaintenanceRequestBase):
    pass

class MaintenanceRequestResponse(MaintenanceRequestBase, DataSourceMixin):
    id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class MaintenanceBlockBase(BaseModel):
    block_code: str
    request_id: Optional[int] = None
    track_section_code: str
    scheduled_start: datetime
    scheduled_end: datetime
    duration_hours: float = 2.0
    status: str = "Scheduled"
    block_type: str = "Routine"
    impact_level: str = "Low"
    delay_impact_minutes: float = 0.0
    zone: Optional[str] = None

class MaintenanceBlockResponse(MaintenanceBlockBase, DataSourceMixin):
    id: int
    created_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class MaintenanceOverviewResponse(BaseModel):
    active_blocks_count: int
    pending_requests_count: int
    scheduled_blocks: List[MaintenanceBlockResponse]
    requests: List[MaintenanceRequestResponse]
