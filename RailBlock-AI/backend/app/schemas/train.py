from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from . import DataSourceMixin

class StationBase(BaseModel):
    station_code: str
    station_name: str
    zone: Optional[str] = None
    state: Optional[str] = None
    address: Optional[str] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None

class StationResponse(StationBase, DataSourceMixin):
    id: int
    model_config = ConfigDict(from_attributes=True)

class TrackSectionBase(BaseModel):
    section_code: str
    section_name: str
    zone: Optional[str] = None
    start_station_code: Optional[str] = None
    end_station_code: Optional[str] = None
    length_km: float = 50.0
    capacity: int = 2
    electrified: bool = True
    maintenance_required: bool = False
    availability_status: str = "Operational"

class TrackSectionResponse(TrackSectionBase, DataSourceMixin):
    id: int
    model_config = ConfigDict(from_attributes=True)

class TrainBase(BaseModel):
    train_number: str
    train_name: str
    train_type: Optional[str] = "Express"
    zone: Optional[str] = None
    from_station_code: Optional[str] = None
    from_station_name: Optional[str] = None
    to_station_code: Optional[str] = None
    to_station_name: Optional[str] = None
    departure_time: Optional[str] = None
    arrival_time: Optional[str] = None
    duration_h: int = 0
    duration_m: int = 0
    distance_km: float = 0.0
    max_speed: float = 110.0
    priority: int = 1
    classes: Optional[str] = None

class TrainResponse(TrainBase, DataSourceMixin):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ScheduleBase(BaseModel):
    train_number: str
    train_name: Optional[str] = None
    station_code: str
    station_name: Optional[str] = None
    arrival_time: Optional[str] = None
    departure_time: Optional[str] = None
    day: int = 1
    sequence_number: int = 1

class ScheduleResponse(ScheduleBase, DataSourceMixin):
    id: int
    model_config = ConfigDict(from_attributes=True)

class PaginatedTrainsResponse(BaseModel):
    items: List[TrainResponse]
    total: int
    page: int
    size: int
    total_pages: int

class PaginatedStationsResponse(BaseModel):
    items: List[StationResponse]
    total: int
    page: int
    size: int
    total_pages: int
