# Architecture Decision Records (ADR)

## ADR-001: Modular Monolith Architecture
- **Status:** Accepted
- **Context:** A 7-day development timeline for a 17-outlet restaurant ordering system + KDS.
- **Decision:** Use a Modular Monolith (FastAPI backend + React frontend) sharing a single PostgreSQL database, organized internally by domain modules (`auth`, `outlets`, `menu`, `orders`, `kitchen`, `ml`).
- **Alternatives Considered:** Microservices (independent services for Order, Kitchen, Menu).
- **Trade-off:** Microservices introduce network latency, distributed transaction complexity (Saga pattern), and high DevOps overhead unsuitable for a 7-day window. The modular monolith provides clear module boundaries and simple ACID transactions with zero network overhead between modules.

## ADR-002: PostgreSQL as the Single Source of Truth
- **Status:** Accepted
- **Context:** Orders, payments, kitchen status updates, and audit trails require strict transactional consistency.
- **Decision:** Use PostgreSQL with ACID transactions. Real-time updates (WebSockets) will only broadcast events *after* state is successfully committed to PostgreSQL.
- **Alternatives Considered:** In-memory stores (Redis) as primary state, or treating WebSocket message streams as state.
- **Trade-off:** WebSockets are ephemeral; connections drop in busy kitchens. Storing authoritative state in PostgreSQL ensures any client can reconcile its complete state via REST on reconnect.

## ADR-003: Hybrid Base + Override Menu Pricing
- **Status:** Accepted
- **Context:** Different outlets (e.g., Cloud Kitchen vs. Flagship Dine-in) may have different pricing or out-of-stock items.
- **Decision:** `menu_items` stores central defaults (`base_price`, dietary flags, allergens). `outlet_menu_items` stores nullable overrides (`price_override`, `is_available`).
- **Alternatives Considered:** Storing pricing solely per-outlet, or strictly centrally.
- **Trade-off:** Allows chain-wide menu catalog management with full flexibility for localized pricing and stock availability.