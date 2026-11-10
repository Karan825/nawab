import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_menu_crud_and_price_sync():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Create a new dish
        create_payload = {
            "name": "Shahi Gosht Haleem",
            "tagline": "Pure mutton, broken wheat, and desi ghee pounded for 12 hours",
            "description": "Slow cooked Nizami haleem served with fried onions, fresh mint, and lemon.",
            "category": "Starters",
            "dietary": "NON_VEG",
            "spice_level": "MEDIUM",
            "base_price": 290.0,
            "preparation_time_minutes": 15,
            "bestseller": True
        }
        res = await client.post("/api/menu", json=create_payload)
        assert res.status_code == 201, res.text
        item_data = res.json()
        item_id = item_data["id"]
        assert item_data["name"] == "Shahi Gosht Haleem"
        assert item_data["base_price"] == 290.0

        # 2. Update price in central CMS
        update_payload = {
            "base_price": 320.0,
            "tagline": "Updated premium haleem"
        }
        res_update = await client.patch(f"/api/menu/{item_id}", json=update_payload)
        assert res_update.status_code == 200
        assert res_update.json()["base_price"] == 320.0
        assert res_update.json()["tagline"] == "Updated premium haleem"

        # 3. Check outlet availability override (pause stock in Gachibowli)
        override_payload = {
            "is_available": False,
            "custom_status_label": "Sold Out Today"
        }
        res_ov = await client.post(f"/api/menu/outlet/out-gachibowli/item/{item_id}/override", json=override_payload)
        assert res_ov.status_code == 200
        assert res_ov.json()["is_available"] is False

        # 4. Fetch menu for Gachibowli -> Item must be marked is_available: False
        res_menu_gach = await client.get("/api/menu/outlet/out-gachibowli")
        assert res_menu_gach.status_code == 200
        gach_items = res_menu_gach.json()
        gach_item = next((it for it in gach_items if it["id"] == item_id), None)
        assert gach_item is not None
        assert gach_item["is_available"] is False
        assert gach_item["custom_status_label"] == "Sold Out Today"
        assert gach_item["base_price"] == 320.0  # New updated price visible!

        # 5. Fetch menu for Kondapur -> Item must still be available at updated price 320.0!
        res_menu_kond = await client.get("/api/menu/outlet/out-kondapur")
        assert res_menu_kond.status_code == 200
        kond_items = res_menu_kond.json()
        kond_item = next((it for it in kond_items if it["id"] == item_id), None)
        assert kond_item is not None
        assert kond_item["is_available"] is True
        assert kond_item["base_price"] == 320.0

        # 6. Delete (deactivate) item
        res_del = await client.delete(f"/api/menu/{item_id}")
        assert res_del.status_code == 200

        # 7. Item should no longer appear in active menu
        res_after = await client.get("/api/menu")
        assert not any(it["id"] == item_id for it in res_after.json())
