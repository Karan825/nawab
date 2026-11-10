from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict, Field
from app.models.order import OrderStatus


class OrderItemCreate(BaseModel):
    menu_item_id: Optional[int] = None
    item_slug: Optional[str] = None
    portion_id: Optional[int] = None
    portion_key: Optional[str] = None
    addon_ids: List[int] = []
    addon_keys: List[str] = []
    quantity: int = Field(gt=0, default=1)


class OrderCreateRequest(BaseModel):
    outlet_id: Optional[int] = None
    outlet_slug: Optional[str] = None
    delivery_address_id: Optional[int] = None
    delivery_address_snapshot: Optional[dict] = None
    special_instructions: Optional[str] = None
    items: List[OrderItemCreate] = Field(min_length=1)


class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    menu_item_id: Optional[int] = None
    item_name: str
    portion_name: str
    unit_price: float
    quantity: int
    addon_details: Optional[Any] = None
    total_price: float


class OrderStatusUpdateRequest(BaseModel):
    status: OrderStatus
    note: Optional[str] = None


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_number: str
    customer_id: int
    outlet_id: int
    outlet_name: Optional[str] = None
    status: OrderStatus
    subtotal: float
    gst_amount: float
    delivery_fee: float
    discount_amount: float
    grand_total: float
    special_instructions: Optional[str] = None
    ai_estimated_prep_minutes: Optional[int] = None
    promised_delivery_time: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []
