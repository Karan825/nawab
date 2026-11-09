from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.user import UserRole


class LoginRequest(BaseModel):
    phone_or_email: str
    password: Optional[str] = "password123"


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    phone: str
    role: UserRole
    outlet_id: Optional[int] = None
    is_active: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
