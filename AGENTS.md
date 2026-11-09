# AGENTS.md — Restaurant Ordering Platform & KDS

## 1. Project Overview & Architecture
- **System:** Direct online ordering platform + Kitchen Display System (KDS) for a 17-outlet Hyderabad restaurant chain.
- **Architecture:** Modular Monolith.
  - `frontend/`: React + TypeScript + Vite + Tailwind CSS + TanStack Query.
  - `backend/`: FastAPI + SQLAlchemy + Alembic + Pydantic.
  - `database/`: PostgreSQL (running via Docker).
  - `realtime/`: WebSockets via FastAPI with REST reconciliation on reconnect.
  - `ml/`: scikit-learn regression model for kitchen prep time estimation.
- **Database is the Single Source of Truth:** Never treat WebSocket payloads as the sole record of state.

## 2. Non-Negotiable Business & Security Invariants
1. **Authoritative Backend Pricing:**
   - The backend MUST compute all order totals, line items, add-on additions, and taxes from database records.
   - NEVER trust prices, subtotals, or taxes submitted by the frontend client.
2. **GST 5% Calculation Rule:**
   - Menu prices shown to customers are **inclusive of 5% GST**.
   - Formula: `gst_amount = round(inclusive_amount * 5 / 105, 2)`.
   - NEVER add an extra 5% on top of menu prices.
3. **Cart & Outlet Boundary:**
   - A customer's cart belongs to exactly ONE outlet.
   - Customers cannot order from outlets outside their delivery radius.
   - If the delivery address changes, revalidate outlet serviceability and item availability.
4. **Historical Price & Item Immutability:**
   - `order_items` MUST store snapshot columns (`item_name`, `unit_price`, `portion_name`, `addon_details`).
   - A subsequent menu price change or deletion must NEVER alter historical order receipts.
5. **Simulated Payments & Kitchen Dispatch:**
   - Orders enter kitchen processing (`PLACED`) ONLY after simulated payment succeeds.
   - Payment endpoints must support idempotency keys to prevent double-charging on network retries.
6. **KDS Order Lifecycle:**
   - Status flow: `PLACED` -> `ACCEPTED` -> `PREPARING` -> `READY` -> `HANDED_TO_RIDER`.
   - Transitions must be validated on the backend. No skipping backward or arbitrary status jumps.
7. **AI Prep-Time Rule:**
   - `promised_prep_time = max(ai_estimated_time, outlet_minimum_prep_time)`.
   - If the ML model fails or is offline, use a deterministic fallback calculation.
8. **Role-Based Access Control (RBAC):**
   - Enforce server-side permissions on every endpoint.
   - `CUSTOMER`: can only read and access their own orders and addresses.
   - `KITCHEN_STAFF`: can only view and update orders for their assigned outlet.
   - `ADMIN`: central menu, pricing overrides, outlet configs, and system logs.

## 3. Coding Standards & Conventions
- **Language & Types:** Strict TypeScript on frontend; Python type hints (`pydantic` schemas, `typing`) on backend.
- **Error Handling:** Explicit HTTP exception responses (`status_code`, `detail`, `code`). Avoid unhandled 500 errors.
- **Transactions:** Use atomic database transactions (`session.begin()`) whenever writing orders, line items, and payment logs together.
- **Environment & Secrets:** No hardcoded secrets, ports, or credentials. Use `.env` files loaded via Pydantic Settings.

## 4. Definition of Done
A feature or task is only done when:
1. Implementation matches the architectural rules above.
2. Verification command/test passes.
3. Code is reviewed and committed with a conventional commit message.