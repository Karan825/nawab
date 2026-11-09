import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_and_db_probes(client: AsyncClient):
    r = await client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "healthy"

    r_db = await client.get("/health/db")
    assert r_db.status_code == 200
    assert r_db.json()["status"] == "connected"


@pytest.mark.asyncio
async def test_all_17_outlets_returned(client: AsyncClient):
    res = await client.get("/api/outlets")
    assert res.status_code == 200
    outlets = res.json()
    assert len(outlets) == 17
    slugs = [o["slug"] for o in outlets]
    assert "out-kondapur" in slugs
    assert "out-charminar" in slugs
    assert "out-manikonda-ck" in slugs


@pytest.mark.asyncio
async def test_outlet_serviceability_haversine(client: AsyncClient):
    # Kondapur coordinates: 17.4622, 78.3568, delivery radius ~6.5 km
    # Close location (Botanical garden): lat 17.4630, lng 78.3575 (~0.1 km) -> Serviceable
    res_near = await client.post("/api/outlets/check-serviceability", json={
        "customer_latitude": 17.4630,
        "customer_longitude": 78.3575,
        "outlet_id": 1
    })
    assert res_near.status_code == 200
    data_near = res_near.json()
    assert data_near["is_serviceable"] is True
    assert data_near["distance_km"] < 1.0

    # Far location (Secunderabad ~22 km away) -> Non-serviceable
    res_far = await client.post("/api/outlets/check-serviceability", json={
        "customer_latitude": 17.4400,
        "customer_longitude": 78.5000,
        "outlet_id": 1
    })
    assert res_far.status_code == 200
    data_far = res_far.json()
    assert data_far["is_serviceable"] is False
    assert data_far["distance_km"] > 10.0


@pytest.mark.asyncio
async def test_outlet_specific_menu_overrides(client: AsyncClient):
    # Check Manikonda Cloud Kitchen: Pathar Ka Gosht must have is_available=False
    res = await client.get("/api/menu/outlet/out-manikonda-ck")
    assert res.status_code == 200
    items = res.json()
    pathar = next(it for it in items if it["slug"] == "pathar-ka-gosht")
    assert pathar["is_available"] is False
    assert pathar["custom_status_label"] == "Dine-In Stone Pit Only"


@pytest.mark.asyncio
async def test_authoritative_backend_pricing_and_gst_invariants(client: AsyncClient):
    """
    Invariant 1: Backend computes all order totals, line items, and taxes from database records.
    Invariant 2: All prices inclusive of 5% GST: gst_amount = round(subtotal * 5 / 105, 2).
    Invariant 7: promised_prep_time = max(ai_estimated_time, outlet_minimum_prep_time).
    """
    # Create an order with 2x Royal Chicken Dum Biryani (base 380 each = 760)
    # Note: Client NEVER sends price! Client only sends item_id and quantity!
    order_payload = {
        "outlet_id": 1,
        "items": [
            {
                "menu_item_id": 1,  # Royal Chicken Dum Biryani (base price 380.00)
                "quantity": 2,
                "addon_ids": [1]    # Extra Mirchi Ka Salan (+40.00)
            }
        ],
        "special_instructions": "Make it royal spicy please."
    }
    res = await client.post("/api/orders", json=order_payload)
    assert res.status_code == 201
    order = res.json()

    # Each item = 380 base + 40 addon = 420. For qty 2 = 840.00
    assert order["subtotal"] == 840.00
    assert order["grand_total"] == 840.00

    # GST 5% calculation rule check:
    # 840 * 5 / 105 = 40.00
    expected_gst = round(840.00 * 5.0 / 105.0, 2)
    assert order["gst_amount"] == expected_gst
    assert order["status"] == "PENDING_PAYMENT"

    # AI Prep time check:
    assert order["ai_estimated_prep_minutes"] >= 30  # outlet min prep time is 30 mins

    # Verify OrderItem snapshot columns
    item = order["items"][0]
    assert item["item_name"] == "Royal Chicken Dum Biryani"
    assert item["unit_price"] == 420.00
    assert item["quantity"] == 2
    assert item["total_price"] == 840.00

    # Test Payment Simulation with Idempotency Key (Invariant 5)
    idemp_key = f"test_idemp_{order['order_number']}"
    pay_payload = {
        "order_number": order["order_number"],
        "idempotency_key": idemp_key,
        "payment_method": "UPI_QR",
        "amount": 840.00
    }
    pay_res = await client.post("/api/payments/simulate", json=pay_payload)
    assert pay_res.status_code == 200
    pay_data = pay_res.json()
    assert pay_data["status"] == "SUCCESS"

    # Verify idempotency on retry
    pay_retry = await client.post("/api/payments/simulate", json=pay_payload)
    assert pay_retry.status_code == 200
    assert pay_retry.json()["idempotency_key"] == idemp_key

    # Verify Order transitioned to PLACED
    ord_check = await client.get(f"/api/orders/{order['order_number']}")
    assert ord_check.status_code == 200
    assert ord_check.json()["status"] == "PLACED"

    # Test KDS State Machine Transition (Invariant 6):
    # PLACED -> ACCEPTED -> PREPARING -> READY -> HANDED_TO_RIDER
    # 1. Advance to ACCEPTED
    adv_res1 = await client.patch(f"/api/orders/{order['order_number']}/status", json={"status": "ACCEPTED"})
    assert adv_res1.status_code == 200
    assert adv_res1.json()["status"] == "ACCEPTED"

    # 2. Advance to PREPARING
    adv_res2 = await client.patch(f"/api/orders/{order['order_number']}/status", json={"status": "PREPARING"})
    assert adv_res2.status_code == 200
    assert adv_res2.json()["status"] == "PREPARING"

    # 3. Test illegal transition (e.g. jumping backward to PLACED or skipping to HANDED_TO_RIDER)
    bad_adv = await client.patch(f"/api/orders/{order['order_number']}/status", json={"status": "HANDED_TO_RIDER"})
    assert bad_adv.status_code == 400
    assert "Illegal state transition" in bad_adv.json()["detail"]
