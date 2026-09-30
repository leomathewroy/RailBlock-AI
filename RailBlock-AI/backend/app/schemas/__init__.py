from typing import Optional
from pydantic import BaseModel, ConfigDict

class DataSourceMixin(BaseModel):
    data_source: Optional[str] = "public_dataset" # public_dataset, predicted, simulated, optimized

class Pagination(BaseModel):
    total: int
    page: int
    size: int
    pages: int
