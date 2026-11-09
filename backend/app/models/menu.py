import enum
from datetime import datetime, timezone
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, DateTime, Enum, Integer, Boolean, Numeric, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

if TYPE_CHECKING:
    from app.models.outlet import Outlet


class DietaryType(str, enum.Enum):
    VEG = "VEG"
    NON_VEG = "NON_VEG"


class SpiceLevel(str, enum.Enum):
    MILD = "MILD"
    MEDIUM = "MEDIUM"
    HOT = "HOT"
    EXTRA_HOT = "EXTRA_HOT"


class MenuItem(Base):
    __tablename__ = "menu_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    tagline: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    dietary: Mapped[DietaryType] = mapped_column(
        Enum(DietaryType, name="dietary_type_enum"),
        default=DietaryType.NON_VEG,
        nullable=False,
    )
    spice_level: Mapped[SpiceLevel] = mapped_column(
        Enum(SpiceLevel, name="spice_level_enum"),
        default=SpiceLevel.MEDIUM,
        nullable=False,
    )
    # INVARIANT: Base price is strictly inclusive of 5% GST
    base_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    preparation_time_minutes: Mapped[int] = mapped_column(Integer, default=25, nullable=False)
    rating: Mapped[float] = mapped_column(Numeric(3, 2), default=4.8, nullable=False)
    rating_count: Mapped[int] = mapped_column(Integer, default=500, nullable=False)
    bestseller: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    portions: Mapped[List["PortionOption"]] = relationship(
        "PortionOption", back_populates="menu_item", cascade="all, delete-orphan"
    )
    addons: Mapped[List["AddonOption"]] = relationship(
        "AddonOption", back_populates="menu_item", cascade="all, delete-orphan"
    )
    outlet_overrides: Mapped[List["OutletMenuItemOverride"]] = relationship(
        "OutletMenuItemOverride", back_populates="menu_item", cascade="all, delete-orphan"
    )


class PortionOption(Base):
    __tablename__ = "portion_options"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    menu_item_id: Mapped[int] = mapped_column(
        ForeignKey("menu_items.id", ondelete="CASCADE"), nullable=False, index=True
    )
    portion_key: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    price_modifier: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, nullable=False)
    serves: Mapped[str] = mapped_column(String(50), nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    menu_item: Mapped["MenuItem"] = relationship("MenuItem", back_populates="portions")


class AddonOption(Base):
    __tablename__ = "addon_options"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    menu_item_id: Mapped[int] = mapped_column(
        ForeignKey("menu_items.id", ondelete="CASCADE"), nullable=False, index=True
    )
    addon_key: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(80), nullable=False)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    menu_item: Mapped["MenuItem"] = relationship("MenuItem", back_populates="addons")


class OutletMenuItemOverride(Base):
    __tablename__ = "outlet_menu_overrides"
    __table_args__ = (
        UniqueConstraint("outlet_id", "menu_item_id", name="uq_outlet_menu_item"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    outlet_id: Mapped[int] = mapped_column(
        ForeignKey("outlets.id", ondelete="CASCADE"), nullable=False, index=True
    )
    menu_item_id: Mapped[int] = mapped_column(
        ForeignKey("menu_items.id", ondelete="CASCADE"), nullable=False, index=True
    )
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    custom_status_label: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    outlet: Mapped["Outlet"] = relationship("Outlet", back_populates="menu_overrides")
    menu_item: Mapped["MenuItem"] = relationship("MenuItem", back_populates="outlet_overrides")

