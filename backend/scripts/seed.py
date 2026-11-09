import asyncio
import sys
from pathlib import Path
from datetime import datetime, timezone, timedelta

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.database import async_session_factory, engine
from app.core.security import hash_password
from app.models.user import User, UserRole, Address
from app.models.outlet import Outlet, OutletType
from app.models.menu import (
    MenuItem,
    DietaryType,
    SpiceLevel,
    PortionOption,
    AddonOption,
    OutletMenuItemOverride,
)
from app.models.order import (
    Order,
    OrderStatus,
    OrderItem,
    OrderStatusHistory,
    Payment,
    PaymentStatus,
)

def hash_pw(pw: str) -> str:
    return hash_password(pw)


async def seed():
    print("🌱 Starting database seeding for 17 Outlets, Menus, Users, and Sample Orders...")

    async with async_session_factory() as session:
        # 1. Clean existing records if any
        from sqlalchemy import text
        await session.execute(text("TRUNCATE TABLE order_status_history, payments, order_items, orders, outlet_menu_overrides, portion_options, addon_options, menu_items, addresses, users, outlets RESTART IDENTITY CASCADE;"))
        await session.flush()

        # 2. Seed Users
        customer_user = User(
            name="Karan Sharma",
            email="karan@example.com",
            phone="+91 98765 43210",
            hashed_password=hash_pw("password123"),
            role=UserRole.CUSTOMER,
            is_active=True,
        )
        kitchen_user = User(
            name="Chef Raheem",
            email="chef.kondapur@nawaabs.com",
            phone="+91 98765 43211",
            hashed_password=hash_pw("kitchen123"),
            role=UserRole.KITCHEN_STAFF,
            is_active=True,
        )
        admin_user = User(
            name="Operations Admin",
            email="admin@nawaabs.com",
            phone="+91 98765 43212",
            hashed_password=hash_pw("admin123"),
            role=UserRole.ADMIN,
            is_active=True,
        )

        session.add_all([customer_user, kitchen_user, admin_user])
        await session.flush()

        # Seed Address for customer
        address = Address(
            user_id=customer_user.id,
            label="Home",
            street_address="Flat 402, Royal Palms, Botanical Garden Road",
            landmark="Near Sarath City Mall",
            locality="Kondapur",
            city="Hyderabad",
            latitude=17.462200,
            longitude=78.356800,
            is_default=True,
        )
        session.add(address)
        await session.flush()

        # 3. Seed 17 Outlets
        outlets_data = [
            # 14 Dine-In Outlets
            {
                "slug": "out-kondapur",
                "name": "Kondapur Flagship Dine-In",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Plot 12, Botanical Garden Road, Kondapur",
                "area": "Kondapur",
                "latitude": 17.4622,
                "longitude": 78.3568,
                "delivery_radius_km": 6.5,
                "min_prep_time_minutes": 30,
                "fssai_license": "13621014000412",
            },
            {
                "slug": "out-charminar",
                "name": "Charminar Heritage Dine-In",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Opposite Mecca Masjid, Pathar Gatti, Charminar",
                "area": "Charminar",
                "latitude": 17.3616,
                "longitude": 78.4747,
                "delivery_radius_km": 5.0,
                "min_prep_time_minutes": 35,
                "fssai_license": "13619011000109",
            },
            {
                "slug": "out-gachibowli",
                "name": "Gachibowli Tech-Park Dine-In",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "DLF Cyber City, Ground Floor, Gachibowli",
                "area": "Gachibowli",
                "latitude": 17.4435,
                "longitude": 78.3570,
                "delivery_radius_km": 7.0,
                "min_prep_time_minutes": 25,
                "fssai_license": "13622014000881",
            },
            {
                "slug": "out-jubilee",
                "name": "Jubilee Hills Royal Courtyard",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Road No. 36, Jubilee Hills",
                "area": "Jubilee Hills",
                "latitude": 17.4319,
                "longitude": 78.4073,
                "delivery_radius_km": 6.0,
                "min_prep_time_minutes": 30,
                "fssai_license": "13620012000521",
            },
            {
                "slug": "out-banjara",
                "name": "Banjara Hills Nizami Hall",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Road No. 12, Banjara Hills",
                "area": "Banjara Hills",
                "latitude": 17.4156,
                "longitude": 78.4357,
                "delivery_radius_km": 6.0,
                "min_prep_time_minutes": 30,
                "fssai_license": "13620012000522",
            },
            {
                "slug": "out-madhapur",
                "name": "Madhapur HITEC Gateway",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Ayyappa Society Main Rd, Madhapur",
                "area": "Madhapur",
                "latitude": 17.4483,
                "longitude": 78.3915,
                "delivery_radius_km": 6.0,
                "min_prep_time_minutes": 25,
                "fssai_license": "13621014000762",
            },
            {
                "slug": "out-hitec",
                "name": "HITEC City Cyber Towers",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Near Cyber Gateway, HITEC City",
                "area": "HITEC City",
                "latitude": 17.4504,
                "longitude": 78.3808,
                "delivery_radius_km": 5.5,
                "min_prep_time_minutes": 25,
                "fssai_license": "13621014000763",
            },
            {
                "slug": "out-kukatpally",
                "name": "Kukatpally Housing Board (KPHB)",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Phase 1, KPHB Colony, Kukatpally",
                "area": "Kukatpally",
                "latitude": 17.4933,
                "longitude": 78.3995,
                "delivery_radius_km": 6.5,
                "min_prep_time_minutes": 30,
                "fssai_license": "13621014000912",
            },
            {
                "slug": "out-begumpet",
                "name": "Begumpet Airport Road",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Opposite Old Airport, Begumpet",
                "area": "Begumpet",
                "latitude": 17.4448,
                "longitude": 78.4678,
                "delivery_radius_km": 5.5,
                "min_prep_time_minutes": 28,
                "fssai_license": "13619011000305",
            },
            {
                "slug": "out-secunderabad",
                "name": "Secunderabad Clock Tower",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Sarojini Devi Road, Secunderabad",
                "area": "Secunderabad",
                "latitude": 17.4399,
                "longitude": 78.4983,
                "delivery_radius_km": 6.0,
                "min_prep_time_minutes": 30,
                "fssai_license": "13619011000306",
            },
            {
                "slug": "out-mehdipatnam",
                "name": "Mehdipatnam Junction",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Rethi Bowli Ring Road, Mehdipatnam",
                "area": "Mehdipatnam",
                "latitude": 17.3916,
                "longitude": 78.4419,
                "delivery_radius_km": 5.5,
                "min_prep_time_minutes": 30,
                "fssai_license": "13620012000841",
            },
            {
                "slug": "out-tolichowki",
                "name": "Tolichowki Arabian Oasis",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Paramount Hills, Tolichowki",
                "area": "Tolichowki",
                "latitude": 17.4018,
                "longitude": 78.4112,
                "delivery_radius_km": 5.5,
                "min_prep_time_minutes": 30,
                "fssai_license": "13620012000842",
            },
            {
                "slug": "out-abids",
                "name": "Abids Vintage Station",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Palace Arcade, Station Road, Abids",
                "area": "Abids",
                "latitude": 17.3891,
                "longitude": 78.4739,
                "delivery_radius_km": 5.0,
                "min_prep_time_minutes": 32,
                "fssai_license": "13619011000045",
            },
            {
                "slug": "out-himayatnagar",
                "name": "Himayatnagar Central",
                "outlet_type": OutletType.PHYSICAL_DINEIN,
                "address": "Street No. 5, Himayatnagar",
                "area": "Himayatnagar",
                "latitude": 17.4042,
                "longitude": 78.4851,
                "delivery_radius_km": 5.5,
                "min_prep_time_minutes": 28,
                "fssai_license": "13619011000046",
            },
            # 3 Dedicated Cloud Kitchens
            {
                "slug": "out-manikonda-ck",
                "name": "Manikonda Dark Kitchen Station",
                "outlet_type": OutletType.CLOUD_KITCHEN,
                "address": "OU Colony, Shaikpet-Manikonda Main Road",
                "area": "Manikonda",
                "latitude": 17.4011,
                "longitude": 78.3792,
                "delivery_radius_km": 7.5,
                "min_prep_time_minutes": 22,
                "fssai_license": "13623014001102",
            },
            {
                "slug": "out-miyapur-ck",
                "name": "Miyapur Metro Cloud Hub",
                "outlet_type": OutletType.CLOUD_KITCHEN,
                "address": "Allwyn X Road, Miyapur Industrial Belt",
                "area": "Miyapur",
                "latitude": 17.4968,
                "longitude": 78.3614,
                "delivery_radius_km": 7.5,
                "min_prep_time_minutes": 22,
                "fssai_license": "13623014001103",
            },
            {
                "slug": "out-uppal-ck",
                "name": "Uppal Ring Road Cloud Kitchen",
                "outlet_type": OutletType.CLOUD_KITCHEN,
                "address": "Inner Ring Road, Uppal X Roads",
                "area": "Uppal",
                "latitude": 17.4056,
                "longitude": 78.5592,
                "delivery_radius_km": 7.5,
                "min_prep_time_minutes": 24,
                "fssai_license": "13623014001104",
            },
        ]

        outlet_instances = {}
        for o_data in outlets_data:
            outlet = Outlet(**o_data)
            session.add(outlet)
            outlet_instances[o_data["slug"]] = outlet

        await session.flush()

        # Connect kitchen staff to Kondapur outlet
        kitchen_user.outlet_id = outlet_instances["out-kondapur"].id

        # 4. Seed Menu Items
        menu_items_data = [
            {
                "slug": "royal-chicken-dum-biryani",
                "name": "Royal Chicken Dum Biryani",
                "tagline": "Slow-cooked handi sealed with dough & aged saffron basmati",
                "description": "Authentic Kachchi dum style tender fresh farm chicken marinated overnight in Nizami spice blend, layered with long-grain basmati rice, pure desi ghee, and slow cooked over charcoal embers.",
                "category": "Biryani",
                "dietary": DietaryType.NON_VEG,
                "spice_level": SpiceLevel.MEDIUM,
                "base_price": 380.00,
                "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
                "preparation_time_minutes": 30,
                "rating": 4.95,
                "rating_count": 8420,
                "bestseller": True,
                "portions": [
                    {"portion_key": "p-std", "name": "Standard Handi (Serves 1–2)", "price_modifier": 0.00, "serves": "1–2 persons", "is_default": True},
                    {"portion_key": "p-jumbo", "name": "Jumbo Feast Handi (Serves 3–4)", "price_modifier": 270.00, "serves": "3–4 persons", "is_default": False},
                    {"portion_key": "p-royal", "name": "Royal Daawat Matka (Serves 5–6)", "price_modifier": 620.00, "serves": "5–6 persons", "is_default": False},
                ],
                "addons": [
                    {"addon_key": "a-salan", "name": "Extra Mirchi Ka Salan (250ml)", "price": 40.00},
                    {"addon_key": "a-raita", "name": "Thick Boondi Dahi Raita", "price": 35.00},
                    {"addon_key": "a-egg", "name": "Boiled Country Eggs (2 pcs)", "price": 30.00},
                    {"addon_key": "a-ghee", "name": "Pure Gir Cow Desi Ghee Pour", "price": 50.00},
                ],
            },
            {
                "slug": "nizami-mutton-dum-biryani",
                "name": "Nizami Mutton Dum Biryani",
                "tagline": "Succulent pot-roasted tender lamb chops and saffron basmati",
                "description": "Selected tender spring lamb marinated for 24 hours in hung yogurt, raw papaya paste, shahi jeera, and Kashmiri saffron, sealed in terracotta handi with whole wheat dough.",
                "category": "Biryani",
                "dietary": DietaryType.NON_VEG,
                "spice_level": SpiceLevel.HOT,
                "base_price": 480.00,
                "image_url": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
                "preparation_time_minutes": 35,
                "rating": 4.92,
                "rating_count": 6120,
                "bestseller": True,
                "portions": [
                    {"portion_key": "p-std", "name": "Standard Handi (Serves 1–2)", "price_modifier": 0.00, "serves": "1–2 persons", "is_default": True},
                    {"portion_key": "p-jumbo", "name": "Jumbo Feast Handi (Serves 3–4)", "price_modifier": 390.00, "serves": "3–4 persons", "is_default": False},
                ],
                "addons": [
                    {"addon_key": "a-salan", "name": "Extra Mirchi Ka Salan (250ml)", "price": 40.00},
                    {"addon_key": "a-ghee", "name": "Pure Gir Cow Desi Ghee Pour", "price": 50.00},
                ],
            },
            {
                "slug": "special-zafrani-mutton-biryani",
                "name": "Special Zafrani Mutton Biryani",
                "tagline": "Double saffron infusion with tender lamb shank",
                "description": "Kashmiri saffron threads steeped in fresh milk, royal whole spices, and slow simmered bone marrow broth layered with aromatic rice.",
                "category": "Biryani",
                "dietary": DietaryType.NON_VEG,
                "spice_level": SpiceLevel.MEDIUM,
                "base_price": 540.00,
                "image_url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80",
                "preparation_time_minutes": 40,
                "rating": 4.97,
                "rating_count": 3200,
                "bestseller": False,
                "portions": [
                    {"portion_key": "p-std", "name": "Handi (Serves 1–2)", "price_modifier": 0.00, "serves": "1–2 persons", "is_default": True},
                ],
                "addons": [
                    {"addon_key": "a-ghee", "name": "Desi Ghee Pour", "price": 50.00},
                ],
            },
            {
                "slug": "tarkari-dum-biryani",
                "name": "Subz-E-Khas Vegetable Dum Biryani",
                "tagline": "Garden vegetables, organic paneer cubes, saffron & mint",
                "description": "Cauliflower florets, carrots, french beans, green peas, and marinated malai paneer layered with basmati and fried brown onions.",
                "category": "Biryani",
                "dietary": DietaryType.VEG,
                "spice_level": SpiceLevel.MEDIUM,
                "base_price": 290.00,
                "image_url": "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80",
                "preparation_time_minutes": 25,
                "rating": 4.78,
                "rating_count": 2940,
                "bestseller": False,
                "portions": [
                    {"portion_key": "p-std", "name": "Standard Handi (Serves 1–2)", "price_modifier": 0.00, "serves": "1–2 persons", "is_default": True},
                    {"portion_key": "p-jumbo", "name": "Jumbo Handi (Serves 3–4)", "price_modifier": 210.00, "serves": "3–4 persons", "is_default": False},
                ],
                "addons": [
                    {"addon_key": "a-raita", "name": "Thick Boondi Dahi Raita", "price": 35.00},
                    {"addon_key": "a-paneer", "name": "Extra Grilled Paneer Cubes", "price": 60.00},
                ],
            },
            {
                "slug": "hyderabadi-chicken-65",
                "name": "Nawaabi Chicken 65",
                "tagline": "Crispy tempered chicken with curry leaves & green chilies",
                "description": "Crispy boneless chicken tossed with southern curry leaves, crushed garlic, and fiery Guntur chilies.",
                "category": "Kebabs & Tandoor",
                "dietary": DietaryType.NON_VEG,
                "spice_level": SpiceLevel.HOT,
                "base_price": 310.00,
                "image_url": "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80",
                "preparation_time_minutes": 15,
                "rating": 4.90,
                "rating_count": 4890,
                "bestseller": True,
                "portions": [
                    {"portion_key": "p-std", "name": "Standard (8 Pcs)", "price_modifier": 0.00, "serves": "1–2 persons", "is_default": True},
                    {"portion_key": "p-large", "name": "Large Platter (16 Pcs)", "price_modifier": 240.00, "serves": "3–4 persons", "is_default": False},
                ],
                "addons": [
                    {"addon_key": "a-chilli-dip", "name": "Spicy Mint Garlic Chutney", "price": 25.00},
                ],
            },
            {
                "slug": "pathar-ka-gosht",
                "name": "Old City Pathar Ka Gosht",
                "tagline": "Mutton strips seared on heated river granite stone",
                "description": "Heritage Charminar recipe where spiced mutton slivers are slow seared on broad heated granite stone with potli masala.",
                "category": "Kebabs & Tandoor",
                "dietary": DietaryType.NON_VEG,
                "spice_level": SpiceLevel.MEDIUM,
                "base_price": 460.00,
                "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
                "preparation_time_minutes": 25,
                "rating": 4.88,
                "rating_count": 840,
                "bestseller": False,
                "portions": [
                    {"portion_key": "p-std", "name": "Standard Plate (6 strips)", "price_modifier": 0.00, "serves": "1–2 persons", "is_default": True},
                ],
                "addons": [
                    {"addon_key": "a-onion", "name": "Lachha Onion & Lemon Bowl", "price": 20.00},
                ],
            },
            {
                "slug": "royal-mutton-shahi-haleem",
                "name": "Royal Shahi Mutton Haleem",
                "tagline": "12-hour slow beaten wheat, meat, lentils & pure desi ghee",
                "description": "Barkaas style authentic Hyderabadi haleem prepared in copper deghs over wood fire with shredded mutton, broken wheat, crushed almonds, and fried onions.",
                "category": "Haleem & Curries",
                "dietary": DietaryType.NON_VEG,
                "spice_level": SpiceLevel.MEDIUM,
                "base_price": 390.00,
                "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
                "preparation_time_minutes": 10,
                "rating": 4.96,
                "rating_count": 5210,
                "bestseller": True,
                "portions": [
                    {"portion_key": "p-single", "name": "Single Bowl (350ml)", "price_modifier": 0.00, "serves": "1 person", "is_default": True},
                    {"portion_key": "p-family", "name": "Family Pack (1000ml)", "price_modifier": 450.00, "serves": "3–4 persons", "is_default": False},
                ],
                "addons": [
                    {"addon_key": "a-ghee", "name": "Extra Desi Ghee Pour", "price": 40.00},
                    {"addon_key": "a-cashew", "name": "Roasted Cashew & Fried Onion Garnish", "price": 50.00},
                ],
            },
            {
                "slug": "double-ka-meetha",
                "name": "Asaf Jahi Double Ka Meetha",
                "tagline": "Golden fried bread steeped in rabdi, saffron & pistachios",
                "description": "Crispy fried milk bread soaked in thick saffron-scented cardamom rabdi and topped with crushed silver vark and almonds.",
                "category": "Desserts",
                "dietary": DietaryType.VEG,
                "spice_level": SpiceLevel.MILD,
                "base_price": 140.00,
                "image_url": "https://images.unsplash.com/photo-1589119908995-c6837fa14d48?auto=format&fit=crop&w=800&q=80",
                "preparation_time_minutes": 5,
                "rating": 4.91,
                "rating_count": 3410,
                "bestseller": True,
                "portions": [
                    {"portion_key": "p-std", "name": "Standard Bowl (2 Pcs)", "price_modifier": 0.00, "serves": "1–2 persons", "is_default": True},
                    {"portion_key": "p-festive", "name": "Festive Platter (4 Pcs)", "price_modifier": 120.00, "serves": "3–4 persons", "is_default": False},
                ],
                "addons": [
                    {"addon_key": "a-rabdi", "name": "Extra Malai Rabdi Layer", "price": 40.00},
                ],
            },
            {
                "slug": "irani-chai",
                "name": "Dum Irani Chai",
                "tagline": "Slow boiled sweet condensed milk and robust decoction",
                "description": "Authentic café style layered Hyderabadi Irani chai made by blending thick condensed mawa milk with bubbling tea decoction.",
                "category": "Beverages",
                "dietary": DietaryType.VEG,
                "spice_level": SpiceLevel.MILD,
                "base_price": 45.00,
                "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
                "preparation_time_minutes": 5,
                "rating": 4.94,
                "rating_count": 2180,
                "bestseller": True,
                "portions": [
                    {"portion_key": "p-single", "name": "Cutting Glass (150ml)", "price_modifier": 0.00, "serves": "1 person", "is_default": True},
                    {"portion_key": "p-flask", "name": "Thermal Flask (500ml / 4 cups)", "price_modifier": 95.00, "serves": "3–4 persons", "is_default": False},
                ],
                "addons": [
                    {"addon_key": "a-osmania", "name": "Osmania Biscuits (4 pcs)", "price": 30.00},
                ],
            },
        ]

        menu_instances = {}
        for m_data in menu_items_data:
            portions = m_data.pop("portions")
            addons = m_data.pop("addons")

            menu_item = MenuItem(**m_data)
            session.add(menu_item)
            await session.flush()

            menu_instances[menu_item.slug] = menu_item

            for p in portions:
                session.add(PortionOption(menu_item_id=menu_item.id, **p))
            for a in addons:
                session.add(AddonOption(menu_item_id=menu_item.id, **a))

        await session.flush()

        # Station Overrides:
        # e.g. Pathar Ka Gosht only available at Charminar & Banjara dine-ins with stone pits
        pathar = menu_instances["pathar-ka-gosht"]
        for ck_slug in ["out-manikonda-ck", "out-miyapur-ck", "out-uppal-ck", "out-kukatpally"]:
            session.add(
                OutletMenuItemOverride(
                    outlet_id=outlet_instances[ck_slug].id,
                    menu_item_id=pathar.id,
                    is_available=False,
                    custom_status_label="Dine-In Stone Pit Only",
                )
            )

        # 5. Seed 3 Initial Assignment Orders from Project Prompt
        # Order 1: WEB-778120 | Kondapur | Chicken dum biryani family pack x1, Double ka meetha x2 | 1180 | UPI | 20:14 | 20:59 | Preparing
        now = datetime.now(timezone.utc)

        o1 = Order(
            order_number="WEB-778120",
            customer_id=customer_user.id,
            outlet_id=outlet_instances["out-kondapur"].id,
            delivery_address_id=address.id,
            delivery_address_snapshot={
                "address": "Flat 402, Aditya Sunshine, Kondapur, Hyderabad",
                "locality": "Kondapur",
                "city": "Hyderabad",
                "phone": customer_user.phone,
            },
            status=OrderStatus.PREPARING,
            subtotal=1180.00,
            gst_amount=round(1180.00 * 5 / 105, 2),  # 56.19
            delivery_fee=0.00,
            discount_amount=0.00,
            grand_total=1180.00,
            special_instructions="Deliver extra onions and lemons please.",
            ai_estimated_prep_minutes=45,
            promised_delivery_time=now + timedelta(minutes=25),
            created_at=now - timedelta(minutes=20),
        )
        session.add(o1)
        await session.flush()

        session.add(
            OrderItem(
                order_id=o1.id,
                menu_item_id=menu_instances["royal-chicken-dum-biryani"].id,
                item_name="Chicken Dum Biryani",
                portion_name="Family Pack (x1)",
                unit_price=800.00,
                quantity=1,
                addon_details=[],
                total_price=800.00,
            )
        )
        session.add(
            OrderItem(
                order_id=o1.id,
                menu_item_id=menu_instances["double-ka-meetha"].id,
                item_name="Double Ka Meetha",
                portion_name="Single Bowl (x2)",
                unit_price=190.00,
                quantity=2,
                addon_details=[],
                total_price=380.00,
            )
        )
        session.add(
            Payment(
                order_id=o1.id,
                idempotency_key="idemp_pay_web_778120_upi",
                payment_method="UPI_QR",
                transaction_reference="TXN_UPI_77812099",
                amount=1180.00,
                status=PaymentStatus.SUCCESS,
            )
        )

        # Order 2: WEB-778131 | Gachibowli cloud kitchen | Veg biryani x2, Mirchi ka salan x1 | 640 | Card | 20:21 | 21:01 | Ready for pickup
        o2 = Order(
            order_number="WEB-778131",
            customer_id=customer_user.id,
            outlet_id=outlet_instances["out-gachibowli"].id,
            delivery_address_id=address.id,
            delivery_address_snapshot={
                "address": "Tower 4, My Home Bhooja, Hitec City, Hyderabad",
                "locality": "Gachibowli",
                "city": "Hyderabad",
                "phone": "+91 98123 45678",
            },
            status=OrderStatus.READY,
            subtotal=640.00,
            gst_amount=round(640.00 * 5 / 105, 2),  # 30.48
            delivery_fee=0.00,
            discount_amount=0.00,
            grand_total=640.00,
            special_instructions="Ready for rider pickup.",
            ai_estimated_prep_minutes=40,
            promised_delivery_time=now + timedelta(minutes=5),
            created_at=now - timedelta(minutes=35),
        )
        session.add(o2)
        await session.flush()

        session.add(
            OrderItem(
                order_id=o2.id,
                menu_item_id=menu_instances["tarkari-dum-biryani"].id,
                item_name="Veg Dum Biryani",
                portion_name="Regular (x2)",
                unit_price=290.00,
                quantity=2,
                addon_details=[],
                total_price=580.00,
            )
        )
        session.add(
            OrderItem(
                order_id=o2.id,
                menu_item_id=menu_instances["royal-chicken-dum-biryani"].id,  # Salan side
                item_name="Mirchi Ka Salan",
                portion_name="Standard (x1)",
                unit_price=60.00,
                quantity=1,
                addon_details=[],
                total_price=60.00,
            )
        )
        session.add(
            Payment(
                order_id=o2.id,
                idempotency_key="idemp_pay_web_778131_card",
                payment_method="CREDIT_CARD",
                transaction_reference="TXN_CARD_8871231",
                amount=640.00,
                status=PaymentStatus.SUCCESS,
            )
        )

        # Order 3: WEB-778146 | Kukatpally | Mutton haleem x3 | 1050 | UPI | 20:26 | 21:16 | Late by 4 minutes
        o3 = Order(
            order_number="WEB-778146",
            customer_id=customer_user.id,
            outlet_id=outlet_instances["out-kukatpally"].id,
            delivery_address_id=address.id,
            delivery_address_snapshot={
                "address": "House 14/B, KPHB Phase 1, Kukatpally, Hyderabad",
                "locality": "Kukatpally",
                "city": "Hyderabad",
                "phone": "+91 99887 76655",
            },
            status=OrderStatus.READY,
            subtotal=1050.00,
            gst_amount=round(1050.00 * 5 / 105, 2),  # 50.00
            delivery_fee=0.00,
            discount_amount=0.00,
            grand_total=1050.00,
            special_instructions="Late alert test order - 4 minutes overdue.",
            ai_estimated_prep_minutes=40,
            promised_delivery_time=now - timedelta(minutes=4),  # 4 minutes overdue
            created_at=now - timedelta(minutes=44),
        )
        session.add(o3)
        await session.flush()

        session.add(
            OrderItem(
                order_id=o3.id,
                menu_item_id=menu_instances["royal-mutton-shahi-haleem"].id,
                item_name="Mutton Haleem",
                portion_name="Regular Pot (x3)",
                unit_price=350.00,
                quantity=3,
                addon_details=[],
                total_price=1050.00,
            )
        )
        session.add(
            Payment(
                order_id=o3.id,
                idempotency_key="idemp_pay_web_778146_upi",
                payment_method="UPI_QR",
                transaction_reference="TXN_UPI_77814611",
                amount=1050.00,
                status=PaymentStatus.SUCCESS,
            )
        )

        await session.commit()
        print("✅ Database seeding successfully completed!")
        print(f" - Seeded {len(outlets_data)} Outlets across Hyderabad")
        print(f" - Seeded {len(menu_items_data)} Menu Items with portions and addons")
        print(f" - Seeded 3 Users (Customer, Kitchen Staff, Admin)")
        print(f" - Seeded 3 Assignment Orders (WEB-778120, WEB-778131, WEB-778146)")


if __name__ == "__main__":
    asyncio.run(seed())
