from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
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


class MenuItemCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    slug: Optional[str] = None
    tagline: Optional[str] = "Fresh Hyderabadi delicacy prepared with pure spices"
    description: Optional[str] = "Authentic recipe slow-cooked to perfection."
    category: str = "Biryani"
    dietary: DietaryType = DietaryType.NON_VEG
    spice_level: SpiceLevel = SpiceLevel.MEDIUM
    base_price: float = Field(gt=0, description="Price strictly inclusive of 5% GST")
    image_url: Optional[str] = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
    preparation_time_minutes: int = Field(default=25, ge=5)
    bestseller: bool = False


class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    dietary: Optional[DietaryType] = None
    spice_level: Optional[SpiceLevel] = None
    base_price: Optional[float] = Field(default=None, gt=0)
    image_url: Optional[str] = None
    preparation_time_minutes: Optional[int] = None
    bestseller: Optional[bool] = None
    is_active: Optional[bool] = None


class OutletOverrideRequest(BaseModel):
    is_available: bool
    custom_status_label: Optional[str] = None
