from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from . import DataSourceMixin

class AssetBase(BaseModel):
    asset_code: str
    asset_name: str
    asset_type: str # Locomotive, Coach, Track, Signalling Equipment
    asset_status: str = "Available" # Available, In Use, Under Maintenance, Reserved
    home_depot: Optional[str] = None
    zone: Optional[str] = None
    track_section_code: Optional[str] = None
    availability_start: Optional[datetime] = None
    availability_end: Optional[datetime] = None
    maintenance_due: Optional[datetime] = None
    utilization_rate: float = 75.0
    health_score: float = 95.0

class AssetCreate(AssetBase):
    pass

class AssetResponse(AssetBase, DataSourceMixin):
    id: int
    updated_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class AssetSummary(BaseModel):
    total_assets: int
    available_locomotives: int
    total_locomotives: int
    available_coaches: int
    total_coaches: int
    track_sections_operational: int
    total_track_sections: int
    signalling_operational: int
    total_signalling: int
    average_utilization_rate: float
    average_health_score: float
    data_source: str = "simulated"

class PaginatedAssetsResponse(BaseModel):
    items: List[AssetResponse]
    total: int
    page: int
    size: int
    total_pages: int
    summary: Optional[AssetSummary] = None
