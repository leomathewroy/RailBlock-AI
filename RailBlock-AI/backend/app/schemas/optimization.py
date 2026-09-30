from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field

class OptimizationRunRequest(BaseModel):
    zone: str = Field(default="NR", description="Railway Zone e.g. NR, WR, CR")
    time_horizon_hours: int = Field(default=24, ge=6, le=72)
    maintenance_tasks: List[Dict[str, Any]] = Field(default=[])
    track_capacities: Optional[Dict[str, int]] = Field(default=None)
    priority_weights: Optional[Dict[str, float]] = Field(default=None)

class ScheduledBlockResult(BaseModel):
    block_id: str
    track_section_code: str
    start_hour: float
    end_hour: float
    duration_hours: float
    priority: str
    delay_impact_minutes: float
    asset_availability_impact: float

class OptimizationRunResponse(BaseModel):
    run_code: str
    solver_status: str # OPTIMAL, FEASIBLE, INFEASIBLE
    objective_value: float
    execution_time_ms: float
    constraints_count: int
    variables_count: int
    total_blocks_scheduled: int
    scheduled_blocks: List[ScheduledBlockResult]
    asset_availability_score: float
    disclaimer: str = "Decision-support recommendation. Requires human validation before operational use."
    data_source: str = "optimized"
