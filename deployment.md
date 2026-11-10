# Deployment & Local Run Guide
## Nawaab's Biryani Co. Direct Ordering Platform & Kitchen Display System (KDS)

**GitHub Repository URL:** [https://github.com/Karan825/nawab](https://github.com/Karan825/nawab)  
**Live App Deployment URL:** [https://nawab-ordering.vercel.app](https://github.com/Karan825/nawab)  

---

## 1. Quick Local Start (Step by Step)

### Prerequisites
- **Node.js**: v18 or v20+
- **Python**: v3.11 or v3.12
- **Docker & Docker Compose**: (For PostgreSQL database)
- **Git**

---

### Step 1: Clone Repository
```bash
git clone https://github.com/Karan825/nawab.git
cd nawab
```

---

### Step 2: Database Setup (PostgreSQL via Docker)
Start the PostgreSQL 16 container:
```bash
docker run -d --name biryani_kds_postgres -e POSTGRES_USER=biryani_admin -e POSTGRES_PASSWORD=biryani_secure_pass -e POSTGRES_DB=biryani_kds_db -p 5432:5432 postgres:16-alpine
```

---

### Step 3: Backend Environment & Migrations
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment template:
   ```bash
   cp ../.env.example ../.env
   ```
5. Apply database migrations:
   ```bash
   alembic upgrade head
   ```
6. Seed the 17 Hyderabad Outlets, complete menu, users, and assignment sample orders:
   ```bash
   python scripts/seed.py
   ```
7. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
   *Interactive API Documentation available at: [http://localhost:8000/docs](http://localhost:8000/docs)*

---

### Step 4: Frontend Web Application
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   - **Customer Storefront & Ordering App:** [http://localhost:5173](http://localhost:5173)
   - **Dedicated Food Ordering App:** [http://localhost:5173/order](http://localhost:5173/order)
   - **Kitchen Display System (KDS):** [http://localhost:5173/kds](http://localhost:5173/kds)
   - **Central Menu CMS & Operations Console:** [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 2. Reviewer Demo Credentials & Universal Bypass

Use either the universal 1-click demo bypass or the pre-configured accounts below:

### Universal 1-Click Demo Credentials (Fastest for Reviewers)
* **Customer Storefront (`/order`):** Identifier `demo` | Password `demo` *(or click the "Fill Demo" pill)*
* **Kitchen Staff KDS (`/kds`):** Identifier `demokitchen` (or `demo`) | Password `demo` *(or click "Instant KDS Demo Access")*
* **Operations Admin (`/admin`):** Identifier `demoadmin` (or `demo`) | Password `demo` *(or click "Instant Admin CMS Demo Access")*

### Production Role Accounts (Argon2id Encrypted)
| Role | Username / Identifier | Password | Assigned Scope | Description |
|------|------------------------|----------|----------------|-------------|
| **Customer** | `+91 98765 43210` or `karan@example.com` or `demo` | `password123` or `demo` | Personal orders & addresses | Place direct orders, test coupons & loyalty rewards |
| **Kitchen Staff** | `chef.kondapur@nawaabs.com` or `demokitchen` | `kitchen123` or `demo` | `Kondapur Flagship Dine-In` (Station 1) | KDS order queue, dumpling timers, rider dispatch |
| **Operations Admin** | `admin@nawaabs.com` or `demoadmin` | `admin123` or `demo` | Global (All 17 Outlets) | Central menu CMS, pricing overrides, delay alert monitor |

*Tip: In the Customer Storefront, clicking **"Login to Order"** allows login with email/phone and password, 1-click demo autofill, or switching between tabs for instant signup.*

---

## 3. Environment Variables (Names Only)

The application requires the following environment variables (defined in `.env`):

| Variable Name | Description |
|---------------|-------------|
| `PROJECT_NAME` | Display name of the service |
| `ENVIRONMENT` | Runtime environment (`development`, `production`) |
| `DEBUG` | Verbose logging & SQL echo toggle (`True` / `False`) |
| `DATABASE_URL` | Async connection string for PostgreSQL (`postgresql+asyncpg://...`) |
| `DATABASE_URL_SYNC` | Sync connection string for Alembic migrations (`postgresql+psycopg2://...`) |
| `SECRET_KEY` | JWT signing secret for bearer authentication |
| `ALGORITHM` | Cryptographic algorithm for JWT tokens (`HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration duration |
| `CORS_ORIGINS` | Permitted client origin URLs |

---

## 4. Production Deployment Guide

### Option A: Docker Compose Deployment (Single Command)
Build and run the entire stack (PostgreSQL, FastAPI backend, and Nginx frontend) via Docker Compose:
```bash
docker compose up -d --build
```

### Option B: Deploying Backend on Render (Step by Step)

#### Method 1: Automatic Blueprint (Easiest & Recommended)
1. Go to [https://dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **"New +"** in the top navigation and select **"Blueprint"**.
3. Connect your GitHub repository: `https://github.com/Karan825/nawab`.
4. Render will automatically detect [`render.yaml`](file:///c:/Users/karan/Downloads/Project/render.yaml) from the repository root:
   - It automatically provisions **PostgreSQL Database** (`nawab-db`).
   - It automatically provisions **FastAPI Web Service** (`nawab-backend`).
   - It automatically links `DATABASE_URL` between the database and the web service.
5. Click **"Apply"** to begin deployment.
6. The build script automatically runs migrations (`alembic upgrade head`) and seeds 17 Hyderabad outlets, full menu, and demo users (`python scripts/seed.py`).

---

#### Method 2: Manual Web Service Setup on Render
If setting up services individually on Render:

1. **Create Free PostgreSQL Database:**
   - On the Render dashboard, click **"New +"** &rarr; **"PostgreSQL"**.
   - **Name:** `nawab-db`
   - **Database:** `restaurant_db`
   - **User:** `postgres`
   - **Plan:** Free
   - Click **"Create Database"**.
   - Once created, copy the **"Internal Database URL"** (for services within Render) or **"External Database URL"**.

2. **Create Web Service for FastAPI Backend:**
   - Click **"New +"** &rarr; **"Web Service"**.
   - Connect your repository: `https://github.com/Karan825/nawab`.
   - **Name:** `nawab-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Python`
   - **Build Command:** `chmod +x build.sh && ./build.sh` (or `pip install -r requirements.txt && alembic upgrade head && python scripts/seed.py`)
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

3. **Configure Environment Variables:**
   Under the **"Environment Variables"** tab, add:
   - `DATABASE_URL`: *(Paste your Render PostgreSQL connection string. The app automatically normalizes it to `postgresql+asyncpg://`)*
   - `SECRET_KEY`: `nawaabs_biryani_kds_super_secure_jwt_secret_key_2026_hyderabad`
   - `ENVIRONMENT`: `production`
   - `DEBUG`: `false`
   - `CORS_ORIGINS`: `*`

4. **Verify Deployment:**
   - Once the deploy completes with green status, open your backend URL:
   - Liveness check: `https://your-service.onrender.com/health` &rarr; returns `{"status":"healthy"}`
   - Interactive Swagger API Docs: `https://your-service.onrender.com/docs`

---

## 5. Verification & Testing

To execute automated tests against all non-negotiable invariants:

### Run Backend Integration Tests
```bash
cd backend
pytest -v tests/test_api_invariants.py
```
*Validates: 17 outlets, Haversine delivery boundary, station stock overrides, authoritative 5% GST inclusive calculation, AI prep time prediction, idempotency, and strict KDS state transitions.*

### Run Frontend Build & Typecheck
```bash
cd frontend
npm run build
```
*Validates: TypeScript type safety, asset bundling, and zero compilation warnings.*
