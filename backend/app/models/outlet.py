import enum
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import String, DateTime, Enum, Float, Integer, Boolean, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class OutletType(str, enum.Enum):
    PHYSICAL_DINEIN = "PHYSICAL_DINEIN"
    CLOUD_KITCHEN = "CLOUD_KITCHEN"


class Outlet(Base):
    __tablename__ = "outlets"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    outlet_type: Mapped[OutletType] = mapped_column(
        Enum(OutletType, name="outlet_type_enum"),
        default=OutletType.PHYSICAL_DINEIN,
        nullable=False,
    )
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    area: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    city: Mapped[str] = mapped_column(String(50), default="Hyderabad", nullable=False)
    latitude: Mapped[float] = mapped_column(Numeric(9, 6), nullable=False)
    longitude: Mapped[float] = mapped_column(Numeric(9, 6), nullable=False)
    delivery_radius_km: Mapped[float] = mapped_column(Float, default=6.0, nullable=False)
    min_prep_time_minutes: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    fssai_license: Mapped[str] = mapped_column(String(25), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    staff: Mapped[List["User"]] = relationship("User", back_populates="outlet")
    menu_overrides: Mapped[List["OutletMenuItemOverride"]] = relationship(
        "OutletMenuItemOverride", back_populates="outlet", cascade="all, delete-orphan"
    )
    orders: Mapped[List["Order"]] = relationship("Order", back_populates="outlet")

