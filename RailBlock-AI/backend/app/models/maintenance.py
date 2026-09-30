from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.database import Base

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_code = Column(String(32), unique=True, index=True, nullable=False)
    track_section_id = Column(Integer, ForeignKey("track_sections.id"), nullable=True)
    track_section_code = Column(String(32), nullable=True)
    maintenance_type = Column(String(64), nullable=False) # Track inspection, Track repair, Electrical maintenance, Signalling maintenance, Routine inspection
    priority = Column(String(16), default="Medium") # High, Medium, Low
    required_duration_hours = Column(Float, default=2.0)
    preferred_time_window = Column(String(64), default="02:00-06:00") # early morning off-peak window
    deadline = Column(DateTime, nullable=True)
    status = Column(String(32), default="Pending") # Pending, Approved, Scheduled, Completed, Rejected
    notes = Column(Text, nullable=True)
    zone = Column(String(16), index=True, nullable=True)
    data_source = Column(String(32), default="simulated")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class MaintenanceBlock(Base):
    __tablename__ = "maintenance_blocks"

    id = Column(Integer, primary_key=True, index=True)
    block_code = Column(String(32), unique=True, index=True, nullable=False)
    request_id = Column(Integer, ForeignKey("maintenance_requests.id"), nullable=True)
    track_section_id = Column(Integer, ForeignKey("track_sections.id"), nullable=True)
    track_section_code = Column(String(32), nullable=True)
    scheduled_start = Column(DateTime, nullable=False)
    scheduled_end = Column(DateTime, nullable=False)
    duration_hours = Column(Float, default=2.0)
    status = Column(String(32), default="Scheduled") # Scheduled, Active, Completed, Cancelled
    block_type = Column(String(64), default="Routine")
    impact_level = Column(String(32), default="Low") # Low, Medium, High
    delay_impact_minutes = Column(Float, default=0.0)
    zone = Column(String(16), index=True, nullable=True)
    data_source = Column(String(32), default="optimized")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    request = relationship("MaintenanceRequest")
