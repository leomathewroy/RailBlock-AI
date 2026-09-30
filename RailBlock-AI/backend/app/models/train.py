from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.db.database import Base

class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    station_code = Column(String(16), unique=True, index=True, nullable=False)
    station_name = Column(String(128), index=True, nullable=False)
    zone = Column(String(16), index=True, nullable=True)
    state = Column(String(64), nullable=True)
    address = Column(String(256), nullable=True)
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)
    data_source = Column(String(32), default="public_dataset") # public_dataset, simulated

class TrackSection(Base):
    __tablename__ = "track_sections"

    id = Column(Integer, primary_key=True, index=True)
    section_code = Column(String(32), unique=True, index=True, nullable=False)
    section_name = Column(String(128), index=True, nullable=False)
    zone = Column(String(16), index=True, nullable=True)
    start_station_id = Column(Integer, ForeignKey("stations.id"), nullable=True)
    end_station_id = Column(Integer, ForeignKey("stations.id"), nullable=True)
    start_station_code = Column(String(16), nullable=True)
    end_station_code = Column(String(16), nullable=True)
    length_km = Column(Float, default=50.0)
    capacity = Column(Integer, default=2) # parallel tracks / capacity
    electrified = Column(Boolean, default=True)
    maintenance_required = Column(Boolean, default=False)
    availability_status = Column(String(32), default="Operational") # Operational, Maintenance Block, Restricted
    data_source = Column(String(32), default="simulated")

    start_station = relationship("Station", foreign_keys=[start_station_id])
    end_station = relationship("Station", foreign_keys=[end_station_id])

class Train(Base):
    __tablename__ = "trains"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(32), unique=True, index=True, nullable=False)
    train_name = Column(String(128), index=True, nullable=False)
    train_type = Column(String(64), nullable=True) # Superfast, Express, Mail, Passenger, Freight
    zone = Column(String(16), index=True, nullable=True)
    from_station_code = Column(String(16), nullable=True)
    from_station_name = Column(String(128), nullable=True)
    to_station_code = Column(String(16), nullable=True)
    to_station_name = Column(String(128), nullable=True)
    departure_time = Column(String(32), nullable=True)
    arrival_time = Column(String(32), nullable=True)
    duration_h = Column(Integer, default=0)
    duration_m = Column(Integer, default=0)
    distance_km = Column(Float, default=0.0)
    max_speed = Column(Float, default=110.0)
    priority = Column(Integer, default=1) # 1=High (Rajdhani/Vande Bharat), 2=Medium, 3=Freight
    classes = Column(String(64), nullable=True)
    data_source = Column(String(32), default="public_dataset")

class Schedule(Base):
    __tablename__ = "schedules"

    id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(32), index=True, nullable=False)
    train_name = Column(String(128), nullable=True)
    station_code = Column(String(16), index=True, nullable=False)
    station_name = Column(String(128), nullable=True)
    arrival_time = Column(String(32), nullable=True)
    departure_time = Column(String(32), nullable=True)
    day = Column(Integer, default=1)
    sequence_number = Column(Integer, default=1)
    data_source = Column(String(32), default="public_dataset")
