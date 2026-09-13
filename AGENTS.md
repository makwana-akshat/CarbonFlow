# Agent Directives & Engineering Guidelines for CarbonFlow

This document serves as the absolute source of truth for all AI agents, engineers, and developers contributing to the CarbonFlow platform. You **must** adhere strictly to these architectural boundaries, design patterns, and systemic rules.

---

## 1. System Architecture & Tech Stack

### Frontend Ecosystem
- **Framework**: React 18 with Vite (`/frontend`)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS combined with custom CSS variables in `index.css` for a premium, glassmorphism-inspired dark-mode aesthetic.
- **Server State**: React Query (`@tanstack/react-query`) for caching, pagination, and background refetching.
- **Client State**: Zustand (`useAppStore`) for transient UI states (e.g., current active role, mobile sidebar visibility).
- **Authentication**: `@clerk/clerk-react`

### Backend Ecosystem
- **Framework**: FastAPI (Python 3.9+) (`/backend/app`)
- **Validation**: Pydantic models (V2) for strong request/response schemas.
- **Database**: Supabase PostgreSQL.
- **Database Client**: `supabase-py` (PostgREST wrapper).
- **Authentication**: PyJWT to decode and cryptographically verify Clerk session tokens using Clerk's JWKS endpoint.

---

## 2. Core Operational Rules (CRITICAL)

### A. The "No Mock Data" Mandate
CarbonFlow is a production-grade clearinghouse. **Under no circumstances should you hardcode arrays of mock data** in frontend components (except for visual skeleton loaders).
- All lists (Dashboard KPIs, Marketplace Listings, Active Orders, Contracts) must fetch from `/api/v1/...`.
- If an endpoint does not exist, build the FastAPI route and the corresponding Supabase query first.

### B. Clerk IDs vs Internal UUIDs
This is the most common point of failure. You must deeply understand this mapping:
1. **Frontend Auth**: The frontend uses Clerk. `useAuth().getToken()` retrieves a JWT. The token's subject (`sub`) is a Clerk ID (e.g., `user_2f9a...`).
2. **FastAPI Auth**: `Depends(get_current_user_id)` decodes the JWT and returns the Clerk ID string.
3. **Supabase Schema**: The `users` table contains both `id` (Postgres UUID) and `clerk_user_id` (String).
4. **Foreign Keys**: ALL domain tables (`audit_contracts`, `orders`, `co2_listings`, `co2_requests`) reference the **UUID**, never the Clerk string.

**AGENT ACTION REQUIRED**: Whenever a backend service needs to insert or query a domain table using the current user, you **must** translate the Clerk ID to the internal UUID first.
*Example Implementation:*
```python
def _get_internal_user_id(self, clerk_id: str) -> str:
    user_res = self.supabase.table("users").select("id").eq("clerk_user_id", clerk_id).execute()
    if not user_res.data:
        raise ValueError("User not found")
    return user_res.data[0]["id"]
```
*Failure to do this results in `22P02: invalid input syntax for type uuid` errors from Postgres.*

### C. Role-Based Access Control (RBAC) & Persona Toggles
- Users act as either a **Buyer** (demanding CO2) or a **Supplier** (providing CO2).
- The frontend holds this in Zustand (`useAppStore().userRole`).
- Changing the role on the frontend triggers a `PATCH /api/v1/users/me` request to sync the state to the backend database.
- Backend routes are protected via `Depends(require_role("buyer"))` or `Depends(require_role("supplier"))`.
- **AGENT ACTION**: If a user reports a `403 Forbidden` error, it is almost always because their active backend role does not match the endpoint's required role.

---

## 3. Data Models & Supabase Topology

When interacting with the DB or creating new migrations (`/backend/migrations/`), respect the existing relational structure:

- `users`: Core profile. Extended with platform settings (`notif_price_alerts`, `co2_capacity`, `facility_location`, etc.).
- `co2_listings`: Supplier's offered CO2 streams. Tracks `purity_percentage`, `volume_tpa`, `transport_modes`.
- `co2_requests`: Buyer's demand requirements. Tracks `min_purity_required`, `target_price`.
- `orders`: Active physical delivery logistics. Tracks `status` (loading, in-transit, delivered).
- `audit_contracts`: The smart contract ledger. Links buyers to suppliers. Requires an `audit_hash` for immutability.
- `contract_versions` & `contract_timeline_events`: Attached to `audit_contracts` to provide historical versioning and timeline milestones.

---

## 4. UI/UX & Design Paradigms

CarbonFlow must maintain a **Premium, State-of-the-Art** visual standard.
1. **Glassmorphism**: Use `bg-[var(--surface-card)]/90 backdrop-blur-md` for floating elements and sticky headers.
2. **Animations**: Elements should use `animate-fade-in` and smooth transitions (`transition-all duration-300`).
3. **Empty States**: Never show a blank screen. Use the `EmptyState` component with a relevant Lucide icon and clear description.
4. **Error Boundaries**: Wrap API calls in `try/catch`. On failure, show an `ErrorState` component with a retry button, or trigger a `Toast` notification for mutations.

---

## 5. Typical Troubleshooting Playbook

- **`401 Unauthorized` on all frontend endpoints**: The Clerk development token has expired or is null. Instruct the user to refresh the Vite page or sign out/in.
- **`403 Forbidden` on POST requests**: The user is trying to execute an action reserved for the opposite role (e.g. Supplier trying to create a buyer inquiry). 
- **`500 Internal Server Error (Pydantic ValidationError)`**: The frontend sent a payload that is missing a required field, or included an unexpected field. Update the Pydantic schema in `/app/schemas/`.
- **`500 Internal Server Error (PGRST200)`**: Missing foreign key relationship in Supabase, or passing a String to a UUID column. Verify the `_get_internal_user_id` mapping.
- **CORS Errors (`Preflight request doesn't pass access control`)**: The frontend is running on a new port (like 5174, 5175). Add it to `allow_origins` in `backend/app/main.py`.
