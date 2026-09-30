from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime, timezone
from app.db.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String(64), index=True, nullable=False) # Conflict, DelayWarning, MaintenanceOverdue, AssetAnomaly
    severity = Column(String(16), index=True, default="Warning") # Critical, Warning, Info
    title = Column(String(128), nullable=False)
    message = Column(String(256), nullable=False)
    entity_type = Column(String(32), nullable=True) # train, track_section, asset
    entity_id = Column(String(64), nullable=True)
    is_resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
