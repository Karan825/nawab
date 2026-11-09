from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.menu import MenuItem, OutletMenuItemOverride
from app.models.outlet import Outlet
from app.schemas.menu import MenuItemResponse

router = APIRouter(prefix="/menu", tags=["Menu"])


@router.get("", response_model=List[MenuItemResponse])
async def get_full_menu(db: AsyncSession = Depends(get_db)):
    """Retrieve all active menu items with portions and addons."""
    stmt = (
        select(MenuItem)
        .where(MenuItem.is_active == True)
        .options(selectinload(MenuItem.portions), selectinload(MenuItem.addons))
        .order_by(MenuItem.id)
    )
    result = await db.execute(stmt)
    items = result.scalars().all()
    return [MenuItemResponse.model_validate(it) for it in items]


@router.get("/outlet/{outlet_id_or_slug}", response_model=List[MenuItemResponse])
async def get_outlet_specific_menu(
    outlet_id_or_slug: str, db: AsyncSession = Depends(get_db)
):
    """
    Retrieve menu items tailored dynamically to a specific outlet's inventory/stone-pit availability.
    Applies overrides from outlet_menu_overrides table.
    """
    # 1. Resolve outlet
    if outlet_id_or_slug.isdigit():
        outlet_stmt = select(Outlet).where(Outlet.id == int(outlet_id_or_slug))
    else:
        outlet_stmt = select(Outlet).where(Outlet.slug == outlet_id_or_slug)

    outlet_res = await db.execute(outlet_stmt)
    outlet = outlet_res.scalar_one_or_none()
    if not outlet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outlet not found")

    # 2. Fetch all menu items
    items_stmt = (
        select(MenuItem)
        .where(MenuItem.is_active == True)
        .options(selectinload(MenuItem.portions), selectinload(MenuItem.addons))
        .order_by(MenuItem.id)
    )
    items_res = await db.execute(items_stmt)
    menu_items = items_res.scalars().all()

    # 3. Fetch overrides for this outlet
    overrides_stmt = select(OutletMenuItemOverride).where(
        OutletMenuItemOverride.outlet_id == outlet.id
    )
    overrides_res = await db.execute(overrides_stmt)
    overrides = {ov.menu_item_id: ov for ov in overrides_res.scalars().all()}

    # 4. Map and apply availability
    response_items = []
    for it in menu_items:
        it_dict = MenuItemResponse.model_validate(it).model_dump()
        if it.id in overrides:
            ov = overrides[it.id]
            it_dict["is_available"] = ov.is_available
            it_dict["custom_status_label"] = ov.custom_status_label
        else:
            it_dict["is_available"] = True
            it_dict["custom_status_label"] = None
        response_items.append(MenuItemResponse(**it_dict))

    return response_items

