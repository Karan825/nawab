from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.models.menu import DietaryType, SpiceLevel


class PortionOptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    portion_key: str
    name: str
    price_modifier: float
    serves: str
    is_default: bool


class AddonOptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    addon_key: str
    name: str
    price: float
    is_active: bool


class MenuItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str
    tagline: str
    description: str
    category: str
    dietary: DietaryType
    spice_level: SpiceLevel
    base_price: float
    image_url: str
    preparation_time_minutes: int
    rating: float
    rating_count: int
    bestseller: bool
    is_active: bool
    portions: List[PortionOptionResponse] = []
    addons: List[AddonOptionResponse] = []
    is_available: bool = True
    custom_status_label: Optional[str] = None
