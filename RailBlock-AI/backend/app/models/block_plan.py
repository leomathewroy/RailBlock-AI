from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.database import Base

class BlockPlan(Base):
    __tablename__ = "block_plans"

    id = Column(Integer, primary_key=True, index=True)
    plan_code = Column(String(64), unique=True, index=True, nullable=False)
    name = Column(String(128), nullable=False)
    plan_date = Column(String(32), nullable=False) # YYYY-MM-DD
    zone = Column(String(16), index=True, nullable=True)
    time_horizon_hours = Column(Integer, default=24)
    status = Column(String(32), default="Active") # Draft, Active, Approved, Executed, Archived
    total_blocks = Column(Integer, default=0)
    estimated_delay_reduction_pct = Column(Float, default=30.0)
    asset_availability_score = Column(Float, default=85.0) # Percentage
    parameters_json = Column(Text, nullable=True) # JSON config used to generate
    solver_status = Column(String(32), default="OPTIMAL")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    items = relationship("BlockPlanItem", back_populates="plan", cascade="all, delete-orphan")

class BlockPlanItem(Base):
    __tablename__ = "block_plan_items"

    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("block_plans.id"), nullable=False)
    track_section_code = Column(String(32), index=True, nullable=False)
    track_section_name = Column(String(128), nullable=False)
    start_time = Column(String(32), nullable=False) # e.g. "02:00" or ISO format
    end_time = Column(String(32), nullable=False) # e.g. "04:30"
    duration_hours = Column(Float, default=2.5)
    block_type = Column(String(64), default="Track Maintenance")
    priority = Column(String(16), default="Medium")
    train_impact_count = Column(Integer, default=0)
    delay_impact_minutes = Column(Float, default=0.0)
    asset_code = Column(String(64), nullable=True)
    status = Column(String(32), default="Recommended")
    is_optimized = Column(Boolean, default=True)
    data_source = Column(String(32), default="optimized")

    plan = relationship("BlockPlan", back_populates="items")
