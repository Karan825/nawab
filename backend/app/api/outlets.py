import math
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.core.database import get_db
from app.models.outlet import Outlet
from app.schemas.outlet import (
    OutletResponse,
    OutletAvailabilityCheckRequest,
    OutletAvailabilityCheckResponse,
)

router = APIRouter(prefix="/outlets", tags=["Outlets"])


def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in kilometers between two GPS coordinates using Haversine formula."""
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)


@router.get("", response_model=List[OutletResponse])
async def list_outlets(db: AsyncSession = Depends(get_db)):
    """Retrieve all 17 Hyderabad restaurant outlets & cloud kitchens."""
    stmt = select(Outlet).where(Outlet.is_active == True).order_by(Outlet.id)
    result = await db.execute(stmt)
    outlets = result.scalars().all()
    return [OutletResponse.model_validate(o) for o in outlets]


@router.get("/{id_or_slug}", response_model=OutletResponse)
async def get_outlet(id_or_slug: str, db: AsyncSession = Depends(get_db)):
    """Retrieve an outlet by either numeric ID or string slug."""
    if id_or_slug.isdigit():
        stmt = select(Outlet).where(Outlet.id == int(id_or_slug))
    else:
        stmt = select(Outlet).where(Outlet.slug == id_or_slug)

    result = await db.execute(stmt)
    outlet = result.scalar_one_or_none()
    if not outlet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outlet not found")
    return OutletResponse.model_validate(outlet)


@router.post("/check-serviceability", response_model=OutletAvailabilityCheckResponse)
async def check_serviceability(
    req: OutletAvailabilityCheckRequest, db: AsyncSession = Depends(get_db)
):
    """
    Validate whether customer location is within outlet delivery radius.
    Invariant 3: Cart belongs to exactly ONE outlet within delivery radius.
    """
    stmt = select(Outlet).where(Outlet.id == req.outlet_id, Outlet.is_active == True)
    result = await db.execute(stmt)
    outlet = result.scalar_one_or_none()
    if not outlet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outlet not found")

    distance_km = calculate_haversine_distance(
        req.customer_latitude, req.customer_longitude, float(outlet.latitude), float(outlet.longitude)
    )
    is_serviceable = distance_km <= outlet.delivery_radius_km

    return OutletAvailabilityCheckResponse(
        is_serviceable=is_serviceable,
        distance_km=distance_km,
        max_radius_km=outlet.delivery_radius_km,
        outlet_id=outlet.id,
        outlet_name=outlet.name,
        min_prep_time_minutes=outlet.min_prep_time_minutes,
    )
