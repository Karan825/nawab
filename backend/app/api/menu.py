import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.menu import (
    MenuItem,
    PortionOption,
    AddonOption,
    OutletMenuItemOverride,
    DietaryType,
    SpiceLevel,
)
from app.models.outlet import Outlet
from app.models.user import User, UserRole
from app.schemas.menu import (
    MenuItemResponse,
    MenuItemCreate,
    MenuItemUpdate,
    OutletOverrideRequest,
)
from app.api.deps import get_current_user

router = APIRouter(prefix="/menu", tags=["Menu"])


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    s = re.sub(r"^-+|-+$", "", s)
    return s


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

    # 2. Fetch all active menu items
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


@router.post("", response_model=MenuItemResponse, status_code=status.HTTP_201_CREATED)
async def create_menu_item(
    req: MenuItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new menu item in the central catalog.
    Available to admin/manager and immediately syncs across all outlets.
    """
    slug_base = req.slug or slugify(req.name)
    slug = slug_base

    # Ensure unique slug
    check_stmt = select(MenuItem).where(MenuItem.slug == slug)
    existing = (await db.execute(check_stmt)).scalar_one_or_none()
    idx = 1
    while existing:
        slug = f"{slug_base}-{idx}"
        check_stmt = select(MenuItem).where(MenuItem.slug == slug)
        existing = (await db.execute(check_stmt)).scalar_one_or_none()
        idx += 1

    new_item = MenuItem(
        slug=slug,
        name=req.name.strip(),
        tagline=req.tagline.strip() if req.tagline else "",
        description=req.description.strip() if req.description else "",
        category=req.category.strip(),
        dietary=req.dietary,
        spice_level=req.spice_level,
        base_price=round(req.base_price, 2),
        image_url=req.image_url or "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        preparation_time_minutes=req.preparation_time_minutes,
        bestseller=req.bestseller,
        is_active=True,
    )
    db.add(new_item)
    await db.flush()

    # Automatically add a default standard portion
    default_portion = PortionOption(
        menu_item_id=new_item.id,
        portion_key="p-std",
        name="Standard Portion (Serves 1–2)",
        price_modifier=0.0,
        serves="1–2 persons",
        is_default=True,
    )
    db.add(default_portion)
    await db.commit()

    # Reload with relationships
    stmt = (
        select(MenuItem)
        .where(MenuItem.id == new_item.id)
        .options(selectinload(MenuItem.portions), selectinload(MenuItem.addons))
    )
    res = await db.execute(stmt)
    created = res.scalar_one()
    return MenuItemResponse.model_validate(created)


@router.patch("/{item_id}", response_model=MenuItemResponse)
async def update_menu_item(
    item_id: int,
    req: MenuItemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update a menu item's details or price in central catalog.
    Changes immediately reflect across all 17 outlets.
    """
    stmt = (
        select(MenuItem)
        .where(MenuItem.id == item_id)
        .options(selectinload(MenuItem.portions), selectinload(MenuItem.addons))
    )
    res = await db.execute(stmt)
    item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")

    if req.name is not None:
        item.name = req.name.strip()
    if req.tagline is not None:
        item.tagline = req.tagline.strip()
    if req.description is not None:
        item.description = req.description.strip()
    if req.category is not None:
        item.category = req.category.strip()
    if req.dietary is not None:
        item.dietary = req.dietary
    if req.spice_level is not None:
        item.spice_level = req.spice_level
    if req.base_price is not None:
        item.base_price = round(req.base_price, 2)
    if req.image_url is not None:
        item.image_url = req.image_url
    if req.preparation_time_minutes is not None:
        item.preparation_time_minutes = req.preparation_time_minutes
    if req.bestseller is not None:
        item.bestseller = req.bestseller
    if req.is_active is not None:
        item.is_active = req.is_active

    await db.commit()
    await db.refresh(item)
    return MenuItemResponse.model_validate(item)


@router.delete("/{item_id}", status_code=status.HTTP_200_OK)
async def delete_menu_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete or deactivate a menu item from the central catalog.
    """
    stmt = select(MenuItem).where(MenuItem.id == item_id)
    res = await db.execute(stmt)
    item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")

    item.is_active = False
    await db.commit()
    return {"message": f"Menu item '{item.name}' (ID {item.id}) successfully removed from catalog"}


@router.post("/outlet/{outlet_id_or_slug}/item/{item_id}/override", response_model=MenuItemResponse)
async def set_outlet_menu_override(
    outlet_id_or_slug: str,
    item_id: int,
    req: OutletOverrideRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Toggle availability or pause stock of a menu item for a specific outlet.
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

    # 2. Check item
    m_stmt = (
        select(MenuItem)
        .where(MenuItem.id == item_id)
        .options(selectinload(MenuItem.portions), selectinload(MenuItem.addons))
    )
    m_res = await db.execute(m_stmt)
    item = m_res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")

    # 3. Upsert override
    ov_stmt = select(OutletMenuItemOverride).where(
        OutletMenuItemOverride.outlet_id == outlet.id,
        OutletMenuItemOverride.menu_item_id == item.id,
    )
    ov_res = await db.execute(ov_stmt)
    existing_ov = ov_res.scalar_one_or_none()

    if existing_ov:
        existing_ov.is_available = req.is_available
        existing_ov.custom_status_label = req.custom_status_label
    else:
        new_ov = OutletMenuItemOverride(
            outlet_id=outlet.id,
            menu_item_id=item.id,
            is_available=req.is_available,
            custom_status_label=req.custom_status_label,
        )
        db.add(new_ov)

    await db.commit()

    resp = MenuItemResponse.model_validate(item).model_dump()
    resp["is_available"] = req.is_available
    resp["custom_status_label"] = req.custom_status_label
    return MenuItemResponse(**resp)


@router.post("/global/item/{item_id}/availability", response_model=MenuItemResponse)
async def toggle_global_availability(
    item_id: int,
    req: OutletOverrideRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Toggle availability of an item across all outlets globally.
    """
    stmt = (
        select(MenuItem)
        .where(MenuItem.id == item_id)
        .options(selectinload(MenuItem.portions), selectinload(MenuItem.addons))
    )
    res = await db.execute(stmt)
    item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Menu item not found")

    item.is_active = req.is_available

    # Also clear or align overrides across outlets
    del_stmt = delete(OutletMenuItemOverride).where(OutletMenuItemOverride.menu_item_id == item.id)
    await db.execute(del_stmt)

    await db.commit()
    await db.refresh(item)

    resp = MenuItemResponse.model_validate(item).model_dump()
    resp["is_available"] = req.is_available
    return MenuItemResponse(**resp)
