from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.order import PaymentStatus


class PaymentSimulateRequest(BaseModel):
    order_number: str
    idempotency_key: str
    payment_method: str = "UPI_QR"
    amount: float


class PaymentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: int
    order_number: str
    idempotency_key: str
    transaction_reference: str
    amount: float
    status: PaymentStatus
    created_at: datetime
