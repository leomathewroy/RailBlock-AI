from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime, timezone
from app.db.database import Base

class OptimizationRun(Base):
    __tablename__ = "optimization_runs"

    id = Column(Integer, primary_key=True, index=True)
    run_code = Column(String(64), unique=True, index=True, nullable=False)
    zone = Column(String(16), index=True, nullable=True)
    solver_status = Column(String(32), default="OPTIMAL") # OPTIMAL, FEASIBLE, INFEASIBLE
    objective_value = Column(Float, default=0.0)
    execution_time_ms = Column(Float, default=0.0)
    constraints_count = Column(Integer, default=0)
    variables_count = Column(Integer, default=0)
    parameters_json = Column(Text, nullable=True)
    result_summary_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
