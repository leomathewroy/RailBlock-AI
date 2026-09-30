from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from . import DataSourceMixin

class BlockPlanItemBase(BaseModel):
    track_section_code: str
    track_section_name: str
    start_time: str
    end_time: str
    duration_hours: float = 2.5
    block_type: str = "Track Maintenance"
    priority: str = "Medium"
    train_impact_count: int = 0
    delay_impact_minutes: float = 0.0
    asset_code: Optional[str] = None
    status: str = "Recommended"
    is_optimized: bool = True

class BlockPlanItemResponse(BlockPlanItemBase, DataSourceMixin):
    id: int
    plan_id: int
    model_config = ConfigDict(from_attributes=True)

class BlockPlanBase(BaseModel):
    plan_code: str
    name: str
    plan_date: str
    zone: Optional[str] = "NR"
    time_horizon_hours: int = 24
    status: str = "Active"
    total_blocks: int = 0
    estimated_delay_reduction_pct: float = 30.0
    asset_availability_score: float = 85.0
    solver_status: str = "OPTIMAL"

class BlockPlanResponse(BlockPlanBase, DataSourceMixin):
    id: int
    created_at: Optional[datetime] = None
    items: List[BlockPlanItemResponse] = []
    parameters_json: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class BlockPlanGenerateRequest(BaseModel):
    plan_date: str = Field(default="2026-09-28", description="Date for block plan (YYYY-MM-DD)")
    zone: str = Field(default="NR", description="Railway Zone (e.g. NR, WR, CR, NCR)")
    time_horizon_hours: int = Field(default=24, ge=4, le=72)
    track_section_code: Optional[str] = Field(default=None, description="Specific track section or all in zone")
    maintenance_priority: Optional[str] = Field(default="All", description="All, High, Medium, Low")
    max_concurrent_blocks: int = Field(default=3, ge=1, le=10)
    delay_penalty_weight: float = Field(default=1.5, ge=0.1, le=10.0)
    asset_availability_weight: float = Field(default=2.0, ge=0.1, le=10.0)

class WhatIfAnalysisRequest(BaseModel):
    plan_id: Optional[int] = None
    zone: str = "NR"
    plan_date: str = "2026-09-28"
    block_duration_factor: float = Field(default=1.0, ge=0.5, le=2.5, description="Scale duration (e.g. 1.2 = +20%)")
    maintenance_priority_filter: str = "All"
    track_availability_percentage: float = Field(default=100.0, ge=50.0, le=100.0)
    train_priority_bias: float = Field(default=1.0, ge=0.5, le=2.0)

class ComparisonMetric(BaseModel):
    metric_name: str
    current_value: float
    optimized_value: float
    improvement_pct: float
    unit: str

class BlockPlanComparisonResponse(BaseModel):
    plan_id: int
    plan_name: str
    zone: str
    current_plan_items: List[Dict[str, Any]]
    optimized_plan_items: List[Dict[str, Any]]
    metrics: List[ComparisonMetric]
    disclaimer: str = "Decision-support recommendation prototype. Does not directly control railway infrastructure."
    data_source: str = "optimized"
