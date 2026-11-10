# Nawaab's Biryani Co. Direct Ordering Platform & Kitchen Display System (KDS)

A high-performance direct-to-consumer online ordering platform and real-time Kitchen Display System (KDS) designed for multi-unit restaurant operations across 17 station kitchens in Hyderabad, India.

---

## 1. Executive Summary & Problem Solved

### The Business Challenge
Third-party delivery aggregators (e.g., Swiggy, Zomato) extract between 25% and 30% (averaging 27%) in commission fees on food orders. For a 17-outlet chain generating approximately 52.8 Crore INR annually through delivery channels, aggregator commissions consume over 14.25 Crore INR every year.

Beyond commission loss, third-party aggregators present severe structural liabilities:
1. **Customer Disintermediation:** Aggregators mask customer phone numbers and identities, preventing direct retention, loyalty programs, and relationship building.
2. **Menu Inconsistency & Operational Lag:** Managing stock pauses ("86ing" out-of-stock items) across 17 distinct physical outlets through third-party portals creates delays, leading to canceled orders and customer frustration.
3. **Price Inflation & Inaccurate Taxes:** Aggregator platforms frequently add arbitrary platform fees, packaging surcharges, and incorrect GST additions on top of menu prices.
4. **Kitchen Bottlenecks & Post-Order Anxiety:** Kitchens rely on noisy thermal printers that misplace tickets. Customers receive inaccurate delivery estimates that do not reflect actual on-dum cooking times or station order backlogs.

### The Solution & Economic Proof
This system establishes a dedicated, first-party direct ordering channel paired with a synchronized Kitchen Display System and central operations console.

By shifting just 12% of third-party orders to the direct platform:
- Direct Sales Shift: 6,33,60,000 INR per year.
- Commission Differential: 27% (Aggregator) minus 12% (Payment Gateway + Logistics Fleet) = 15% net savings.
- Annual Commission Recaptured: 95,04,000 INR.
- Bulk Party & Catering Leakage Recovery: 19,44,000 INR.
- Total Annual Net Bottom-Line Profit Increase: 1,14,48,000 INR (approximately 1.14 Crore INR per year).

---

## 2. Live Deployment Endpoints & Navigation

The platform is deployed across modern cloud infrastructure (GitHub Pages for the React SPA client, Render for the FastAPI backend, and managed PostgreSQL for ACID persistence).

| Interface / Console | Production URL / Route | Local Port / Route | Access Role Required |
|---------------------|------------------------|--------------------|----------------------|
| Customer Storefront | `https://karan825.github.io/nawab/` | `http://localhost:5173/` | Public |
| Dedicated Food Ordering App | `https://karan825.github.io/nawab/order` | `http://localhost:5173/order` | Customer (`CUSTOMER`) |
| Checkout & Payment Simulator | `https://karan825.github.io/nawab/checkout` | `http://localhost:5173/checkout` | Customer (`CUSTOMER`) |
| Kitchen Display System (KDS) | `https://karan825.github.io/nawab/kds` | `http://localhost:5173/kds` | Kitchen Staff (`KITCHEN_STAFF`) or Admin |
| Operations Admin & Menu CMS | `https://karan825.github.io/nawab/admin` | `http://localhost:5173/admin` | Operations Admin (`ADMIN`) |
| Backend REST API (Render) | `https://nawab-backend.onrender.com` | `http://localhost:8000` | Machine / System |
| Interactive Swagger API Docs | `https://nawab-backend.onrender.com/docs` | `http://localhost:8000/docs` | Developer / Reviewer |
| System Health Probe | `https://nawab-backend.onrender.com/health` | `http://localhost:8000/health` | Automated / Monitoring |

---

## 3. Reviewer Demo Credentials & Quick Access

All authentication is enforced with Argon2id cryptographic hashing on the server. For rapid evaluation, the application provides pre-configured role accounts as well as a universal bypass:

### Fast Universal Demo Access
- Customer Storefront: Identifier `demo` | Password `demo`
- Kitchen Display System: Identifier `demokitchen` (or `demo`) | Password `demo`
- Operations Admin Console: Identifier `demoadmin` (or `demo`) | Password `demo`

### Pre-Configured Role Credentials
| Role | Username / Identifier | Password | Assigned Scope & Purpose |
|------|------------------------|----------|--------------------------|
| Customer | `+91 98765 43210` or `karan@example.com` | `password123` | Browsing menu, cart customization, loyalty points, order tracking |
| Kitchen Staff | `chef.kondapur@nawaabs.com` | `kitchen123` | Station 1 (Kondapur Flagship): live queue, 86ing items, surge buffer |
| Operations Admin | `admin@nawaabs.com` | `admin123` | Global (All 17 Outlets): menu catalog, price overrides, delay monitors |

---

## 4. System Architecture

The application is architected as a high-throughput **Modular Monolith**.

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT LAYER                                      |
|  +---------------------------+  +------------------------+  +------------------+  |
|  | Customer Web App (Mobile) |  | Kitchen Tablet (KDS)   |  | Central Admin    |  |
|  | React 18 + Vite + Tailwind|  | High-Contrast UI       |  | Operations CMS   |  |
|  +---------------------------+  +------------------------+  +------------------+  |
+------------------------------+-------------+-------------------------+------------+
                               |             | (WebSockets / REST)     |
                               v             v                         v
+-----------------------------------------------------------------------------------+
|                        FASTAPI BACKEND & REAL-TIME GATEWAY                        |
|  +-----------------------+  +------------------------+  +----------------------+  |
|  | /api/auth (JWT/Argon2)|  | /api/orders (Pricing)  |  | /api/menu (Catalog)  |  |
|  +-----------------------+  +------------------------+  +----------------------+  |
|  +-----------------------+  +------------------------+  +----------------------+  |
|  | /api/payments (Sim)   |  | /ws/kds (Live Dispatch)|  | /api/outlets (Geofence)|
|  +-----------------------+  +------------------------+  +----------------------+  |
|  +-----------------------------------------------------------------------------+  |
|  | ML Inference Engine: scikit-learn GradientBoostingRegressor (.joblib)       |  |
|  +-----------------------------------------------------------------------------+  |
+--------------------------------------+--------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
|                              PERSISTENCE LAYER                                    |
|   PostgreSQL 16 (Relational DB, ACID Transactions, Strict Foreign Keys, Indexes)  |
+-----------------------------------------------------------------------------------+
```

### Architectural Decisions

1. **Why a Modular Monolith instead of Microservices?**
   - **Zero Network Serialization Penalty:** In a restaurant processing up to 1,200 orders per hour during peak hours, in-process function execution eliminates inter-service HTTP hops and latency.
   - **Strict ACID Guarantees:** Order writing, snapshot item freezing, payment settlement, and loyalty points deductions execute in a single atomic database transaction (`session.begin()`). Distributed saga patterns in microservices introduce failure windows where money is captured but kitchen tickets are lost.
   - **Operational Simplicity:** A single backend service drastically reduces container orchestration overhead, making the entire platform easy to maintain, audit, and deploy.

2. **Technology Stack:**
   - **Frontend:** React 18, TypeScript (strict mode), Vite, Tailwind CSS, Lucide Vector Icons.
   - **Backend:** FastAPI (Python 3.12), Pydantic v2 schemas, SQLAlchemy 2.0 Async, Alembic database migrations.
   - **Database:** PostgreSQL 16 (asyncpg driver for high-concurrency connection pooling).
   - **Real-Time Communication:** WebSockets via FastAPI for instant kitchen ticket dispatch with automatic REST polling fallback.
   - **Machine Learning:** scikit-learn (`GradientBoostingRegressor`) serialized via `joblib`.

---

## 5. Non-Negotiable Business & Security Invariants

The platform strictly enforces the following core architectural invariants:

### 1. Authoritative Backend Pricing
The frontend client is considered completely untrusted. The backend recalculates every line item price, portion delta, add-on addition, subtotal, and tax strictly from PostgreSQL database records. Submitting tampered totals or modified item prices from the client produces an immediate validation rejection.

### 2. Mandatory Inclusive 5% GST Formula
Menu prices displayed to customers are legally inclusive of 5% GST as mandated by Indian GST restaurant regulations.
```
gst_amount = round(inclusive_amount * 5 / 105, 2)
```
The platform never charges an additional 5% on top of menu prices.

### 3. Outlet Boundaries & Haversine Geofencing
Every order is bound to exactly one of the 17 seeded Hyderabad station kitchens. Using Haversine great-circle trigonometry, the backend computes exact distance between customer GPS coordinates and outlet locations:
- Customers cannot order from an outlet if their address lies outside the station's configured `delivery_radius_km`.
- If an address changes at checkout, serviceability and local item availability are revalidated automatically.

### 4. Historical Price & Item Immutability
The `order_items` table stores snapshot columns (`item_name`, `unit_price`, `portion_name`, `addon_details`, `total_price`). If an administrator subsequently alters menu pricing or deletes a dish, historical customer receipts and accounting ledgers remain permanently unaltered.

### 5. Payment Idempotency & Two-Phase Kitchen Dispatch
Orders enter the kitchen processing queue (`PLACED`) only after payment simulation succeeds. Payment endpoints require an `idempotency_key` (UUID v4) to prevent double-charging on network retries or multiple button clicks.

### 6. Strict KDS Order State Machine
Kitchen orders must follow an unskippable forward lifecycle:
```
PLACED -> ACCEPTED -> PREPARING -> READY -> HANDED_TO_RIDER
```
The backend rejects unauthorized status jumps or backward regressions.

### 7. AI Kitchen Prep Time Invariant
Promised customer delivery times are governed by the rule:
```
promised_prep_time = max(ai_estimated_time, outlet_minimum_prep_time)
```
If the scikit-learn ML model is unavailable or in a cold-start state, the backend falls back to a deterministic calculation factoring base preparation time, active kitchen queue depth, item count, and peak-hour multipliers.

### 8. Outlet-Specific Inventory Control ("86ing")
The platform supports granular stock toggling via `outlet_menu_overrides`. A dish can be marked out-of-stock at a specific station kitchen (e.g., Kondapur) without affecting availability at the other 16 outlets.

---

## 6. Machine Learning Model Architecture

The kitchen preparation estimation system uses a scikit-learn `GradientBoostingRegressor` trained on historical Hyderabadi dum cooking logs.

### Feature Inputs
1. `item_count`: Total number of distinct food portions in the order.
2. `sum_base_prep_minutes`: Aggregate baseline culinary preparation time for all selected items.
3. `active_kitchen_orders`: Number of orders currently in `PLACED`, `ACCEPTED`, or `PREPARING` status at the assigned station.
4. `is_cloud_kitchen`: Binary flag (cloud kitchens feature higher batch throughput than dine-in locations).
5. `is_peak_hour`: Hyderabad lunch rush (12:30 to 15:00 IST) and dinner rush (19:30 to 22:30 IST).

### Model Artifacts & Fallback
- Model artifact: `backend/app/ml/weights/prep_time_model.joblib`
- Training script: `backend/app/ml/train_model.py`
- Deterministic Fallback Formula:
  ```
  fallback_time = base_prep + (active_orders * 1.2) + (item_count * 1.5) + (peak_boost if is_peak else 0)
  ```

---

## 7. Local Development & Setup Guide

### Prerequisites
- Node.js v18 or v20+
- Python 3.11 or 3.12
- Docker & Docker Compose (for PostgreSQL)
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/Karan825/nawab.git
cd nawab
```

### Step 2: Start PostgreSQL Database
```bash
docker run -d \
  --name biryani_kds_postgres \
  -e POSTGRES_USER=biryani_admin \
  -e POSTGRES_PASSWORD=biryani_secure_pass \
  -e POSTGRES_DB=biryani_kds_db \
  -p 5432:5432 \
  postgres:16-alpine
```

### Step 3: Backend Setup & Migrations
```bash
cd backend

# Setup virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.\.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Seed 17 outlets, complete menu catalog, and demo accounts
python scripts/seed.py

# Start the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 4: Frontend Web Application
Open a second terminal window:
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 8. Production Deployment Configuration

### Frontend (GitHub Pages)
The repository includes an automated GitHub Actions deployment workflow at `.github/workflows/deploy.yml`:
1. Navigate to repository **Settings** -> **Pages**.
2. Under **Build and deployment** -> **Source**, select **GitHub Actions**.
3. Every push to the `main` branch builds the Vite bundle with `BASE_PATH=/nawab/` and publishes `dist/index.html` and `dist/404.html` (for SPA client-side routing) to `https://karan825.github.io/nawab/`.
4. In `frontend/src/config.ts`, production domain detection automatically routes all API requests to the live Render backend (`https://nawab-backend.onrender.com`).

### Backend (Render Blueprint)
The repository root contains a validated `render.yaml` Blueprint definition:
- Service: Python web service running `uvicorn app.main:app`.
- Database: Managed PostgreSQL database (`nawab-db`) with user `nawab_user`.
- Start Script: `backend/start.sh` executes migrations (`alembic upgrade head`) and database seeding (`python scripts/seed.py`) at startup before launching the web server.

---

## 9. Automated Test Suite & Verification

The backend includes a comprehensive automated test suite verifying all critical business invariants, API contracts, and pricing integrity.

To execute the test suite:
```bash
cd backend
pytest -v tests
```

### Test Coverage
- `test_health_and_db_probes`: Verifies `/health` endpoint and live database connection pool.
- `test_all_17_outlets_returned`: Confirms all 17 Hyderabad station kitchens are seeded and active.
- `test_outlet_serviceability_haversine`: Validates distance calculations and delivery radius rejections.
- `test_outlet_specific_menu_overrides`: Confirms per-outlet stock pauses ("86ing").
- `test_authoritative_backend_pricing_and_gst_invariants`: Tests strict 5% inclusive GST calculations and prevents client price tampering.
- `test_universal_demo_credentials_and_argon2_auth`: Verifies Argon2id password verification and demo bypass mechanisms.
- `test_menu_crud_and_price_sync`: Tests administrative menu updates and live synchronization.

---

## 10. Repository Structure

```
nawab/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD pipeline
├── backend/
│   ├── alembic/                # Database migrations
│   ├── app/
│   │   ├── api/                # FastAPI routers (auth, menu, orders, outlets, payments, kds)
│   │   ├── core/               # Configuration, security, database session
│   │   ├── models/             # SQLAlchemy ORM models (ACID relational schema)
│   │   ├── schemas/            # Pydantic v2 validation contracts
│   │   └── ml/                 # scikit-learn regression model and weights
│   ├── scripts/
│   │   └── seed.py             # Database seeder (17 outlets, dishes, demo users)
│   ├── tests/                  # Automated integration tests
│   ├── render.yaml             # Render infrastructure specification
│   ├── requirements.txt        # Backend Python dependencies
│   └── start.sh                # Container startup script (migrations + seeding + uvicorn)
├── frontend/
│   ├── src/
│   │   ├── components/         # Navigation, modals, cart drawer, section components
│   │   ├── pages/
│   │   │   ├── OrderDashboardPage.tsx  # Customer ordering dashboard
│   │   │   ├── CheckoutPage.tsx        # Single-page checkout & payment simulator
│   │   │   ├── KDSPage.tsx             # Real-time Kitchen Display System
│   │   │   └── AdminPage.tsx           # Central Menu CMS & Operations Console
│   │   ├── config.ts           # Centralized API and WebSocket routing
│   │   ├── data.ts             # Data models and fallback outlet lists
│   │   └── App.tsx             # Root component and client router
│   ├── copy404.js              # GitHub Pages SPA 404 handler
│   ├── package.json            # Node.js dependencies
│   └── vite.config.ts          # Vite build configuration
├── deployment.md               # Step-by-step operations & deployment guide
├── Technical_Design_Document.md# Detailed technical design specification
└── README.md                   # Main project overview & documentation
```

