from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.outlet import OutletType


class OutletBase(BaseModel):
    slug: str
    name: str
    outlet_type: OutletType
    address: str
    area: str
    city: str
    latitude: float
    longitude: float
    delivery_radius_km: float
    min_prep_time_minutes: int
    fssai_license: str
    is_active: bool


class OutletResponse(OutletBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class OutletAvailabilityCheckRequest(BaseModel):
    customer_latitude: float
    customer_longitude: float
    outlet_id: int


class OutletAvailabilityCheckResponse(BaseModel):
    is_serviceable: bool
    distance_km: float
    max_radius_km: float
    outlet_id: int
    outlet_name: str
    min_prep_time_minutes: int
