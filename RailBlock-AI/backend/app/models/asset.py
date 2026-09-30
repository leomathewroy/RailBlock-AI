from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime, timezone
from app.db.database import Base

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_code = Column(String(64), unique=True, index=True, nullable=False)
    asset_name = Column(String(128), nullable=False)
    asset_type = Column(String(64), index=True, nullable=False) # Locomotive, Coach, Track, Signalling Equipment
    asset_status = Column(String(32), index=True, default="Available") # Available, In Use, Under Maintenance, Reserved
    home_depot = Column(String(128), nullable=True)
    zone = Column(String(16), index=True, nullable=True)
    track_section_id = Column(Integer, ForeignKey("track_sections.id"), nullable=True)
    track_section_code = Column(String(32), nullable=True)
    availability_start = Column(DateTime, nullable=True)
    availability_end = Column(DateTime, nullable=True)
    maintenance_due = Column(DateTime, nullable=True)
    utilization_rate = Column(Float, default=75.0) # Percentage
    health_score = Column(Float, default=95.0)
    data_source = Column(String(32), default="simulated")
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
