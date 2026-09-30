import logging
from fastapi import APIRouter, HTTPException
from app.schemas.optimization import OptimizationRunRequest, OptimizationRunResponse
from app.services.optimization_service import optimization_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/run", response_model=OptimizationRunResponse)
async def run_optimization_engine(req: OptimizationRunRequest):
    """
    Executes the Google OR-Tools CP-SAT solver with specified constraints
    and returns scheduled maintenance blocks.
    """
    try:
        tasks = req.maintenance_tasks
        if not tasks:
            # Generate sample corridor tasks
            tasks = [
                {"track_section_code": f"{req.zone}-SEC1", "duration_hours": 2.5, "priority": "High", "block_type": "Track Repair", "preferred_start_hour": 2},
                {"track_section_code": f"{req.zone}-SEC2", "duration_hours": 2.0, "priority": "Medium", "block_type": "OHE Inspection", "preferred_start_hour": 1},
                {"track_section_code": f"{req.zone}-SEC3", "duration_hours": 3.0, "priority": "High", "block_type": "Signalling Audit", "preferred_start_hour": 3},
                {"track_section_code": f"{req.zone}-SEC4", "duration_hours": 2.0, "priority": "Low", "block_type": "Ballast Cleaning", "preferred_start_hour": 4}
            ]

        res = optimization_service.run_optimization(
            tasks=tasks,
            time_horizon_hours=req.time_horizon_hours
        )

        return OptimizationRunResponse(
            run_code=f"OPT-{req.zone}-AUTO",
            solver_status=res["solver_status"],
            objective_value=res["objective_value"],
            execution_time_ms=res["execution_time_ms"],
            constraints_count=res["constraints_count"],
            variables_count=res["variables_count"],
            total_blocks_scheduled=res["total_blocks_scheduled"],
            scheduled_blocks=res["scheduled_blocks"],
            asset_availability_score=res["asset_availability_score"],
            data_source="optimized"
        )
    except Exception as e:
        logger.error(f"Optimization run error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Optimization solver execution failed")
