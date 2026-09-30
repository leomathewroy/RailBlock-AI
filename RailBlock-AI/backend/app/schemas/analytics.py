from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class TrendDataPoint(BaseModel):
    label: str
    value: float
    secondary_value: Optional[float] = None

class DashboardOverviewResponse(BaseModel):
    total_trains: int
    available_locomotives: int
    total_locomotives: int
    available_coaches: int
    total_coaches: int
    active_maintenance_blocks: int
    average_delay_minutes: float
    asset_utilization_pct: float
    conflicts_detected: int
    delay_reduction_pct: float
    asset_availability_pct: float
    operational_efficiency_pct: float
    
    # Chart series
    hourly_delay_trend: List[TrendDataPoint]
    zone_utilization: List[TrendDataPoint]
    maintenance_by_type: List[TrendDataPoint]
    asset_availability_by_category: Dict[str, float]
    
    # Metadata
    dataset_source: str = "Indian Railways Dataset (Kaggle) + Operational Simulation"
    data_source: str = "public_dataset"
