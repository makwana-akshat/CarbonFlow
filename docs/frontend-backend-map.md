# Frontend-Backend Map

## A. Repository structure
```text
CarbonFlow/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dependencies.py
│   │   │   └── v1/
│   │   │       ├── router.py
│   │   │       └── endpoints/ (users, marketplace, orders, etc.)
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── schemas/ (Pydantic models)
│   │   └── services/ (Business logic)
│   ├── migrations/
│   ├── seed.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/ (UI, layout, features)
│   │   ├── data/ (Mock data)
│   │   ├── services/ (API clients)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts
│   └── package.json
└── docs/
```

## B. Frontend route inventory
- `/` (Landing): Public overview. No data required.
- `/dashboard/overview` (Dashboard): KPIs, Market Prices. Calls `/api/v1/dashboard/summary`.
- `/dashboard/marketplace` (Marketplace): Supply listings. Calls `/api/v1/marketplace/listings`.
- `/dashboard/requirements` (Requirements): Demand requirements. Calls `/api/v1/marketplace/requirements`.
- `/dashboard/recommendations` (Recommendations): Matches. Calls `/api/v1/recommendations`.
- `/dashboard/orders` (Orders): Active orders. Calls `/api/v1/orders/active`.
- `/dashboard/maps` (Maps): Geospatial view. Calls `/api/v1/maps/*`.
- `/dashboard/logistics` (Logistics): Route planning. Calls `/api/v1/logistics/calculate-route`.
- `/app/carbon-impact` (Impact): ESG Analytics. Calls `/api/v1/impact/summary`.
- `/app/alerts` (Alerts): Telemetry. Calls `/api/v1/telemetry/alerts`.
- `/app/audit-contracts` (Contracts): Audit trails. Calls `/api/v1/contracts`.

## C. Frontend component inventory
- `DashboardContent`: Expects KPI metrics. Calls dashboard API.
- `MarketplaceView`: Renders listing cards. Calls marketplace APIs.
- `LogisticsRoutePlanning`: Renders map & transport modes. Calls logistics API.
- `RecommendedMatches`: Expects matched lists. Calls recommendations API.
- `AuditContractsPage`: Renders timelines. Calls contracts API.

## D. Mock data inventory
- `src/data/mockData.ts`, `marketplaceData.ts`, `mockShipments.ts`, `alertsMock.ts`, `auditContractsMock.ts`, `mapsMockData.ts`.
- **Status**: All major mock data sources have already been replaced by actual `fetchWithAuth` calls to the backend APIs in the current repository state.

## E. Frontend API/service inventory
- `src/services/api.ts`: Base fetch wrapper (`fetchWithAuth`).
- `src/services/marketplaceApi.ts`: `getListings`, `getRequirements`.
- `src/services/dashboardApi.ts`: `getDashboardSummary`.
- `src/services/ordersApi.ts`: `getActiveOrders`, `getRecentOrders`.
- `src/services/telemetryApi.ts`: `getAlerts`.
- `src/services/recommendationsApi.ts`: `getRecommendations`.
- `src/services/contractsApi.ts`: `getContracts`, `getComplianceSummary`.
- `src/services/mapService.ts`: `getSuppliers`, `getRoutes`, etc.
- `src/services/logisticsApi.ts`: `calculateRoute`.

## F. TypeScript type inventory
- Located inside component files (e.g., `SupplierNode`, `RouteData`, `Contract`, `SupplyListing`).
- Align perfectly with backend Pydantic models (using alias generators for camelCase).

## G. Forms and mutations
- *Currently Implemented UI Actions*:
  - Create Listing (Mocked in UI, backend supports `POST /marketplace/listings`).
  - Accept Contract (Mocked in UI, backend supports `PATCH /contracts/{id}/status`).
- *Missing Actions*: Full CRUD forms for creating routes, shipments, and complex orders are not fully wired in the frontend UI yet.

## H. Existing backend endpoints
- `GET /api/v1/health`
- `POST /api/v1/users/sync`, `GET /users/me`
- `GET /api/v1/marketplace/listings`, `GET /marketplace/requirements`
- `GET /api/v1/orders/active`, `GET /orders/recent`
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/telemetry/alerts`
- `GET /api/v1/impact/summary`
- `GET /api/v1/recommendations`
- `GET /api/v1/contracts`, `GET /contracts/compliance-summary`
- `GET /api/v1/maps/*`
- `GET /api/v1/logistics/calculate-route`

## I. Existing database schema
- `users`, `co2_listings`, `co2_requests`, `facilities`, `orders`, `alerts`, `recommendations`, `audit_contracts`, `contract_timeline_events`, `contract_versions`, `routes`.

## J. Authentication architecture
- Frontend uses `@clerk/clerk-react`.
- Backend uses FastAPI dependency (`app.api.dependencies.get_current_user_id`) to verify the `Authorization: Bearer <token>` against Clerk's JWKS. Identifies user by `clerk_user_id`.

## K. Frontend → Backend mapping
- Almost 1:1 mapping exists for all core features (Phases 1-12) as outlined in the route inventory.

## L. Missing APIs
- Advanced AI Features (Phase 13): `/api/v1/ai/insights`, `/api/v1/ai/chatbot`, `/api/v1/ai/forecast`.
- Deep mutation endpoints (e.g., full order creation workflow).

## M. Missing database tables
- Tables for AI features (`ai_chat_logs`, `price_alerts`).

## N. Security issues
- RLS (Row Level Security) is not fully enabled on all Supabase tables.
- `SUPABASE_SERVICE_ROLE_KEY` is used in the backend (safe), but we must ensure it never leaks to the frontend.

## O. Data-model mismatches
- Minor UI string formatting (e.g., `"₹4,500/t"`) vs database numeric fields (`price_per_ton = 4500`). The backend handles formatting currently via Pydantic or frontend mapping.

## P. Google Maps requirements
- `LogisticsRoutePlanning` and `MapsPage` currently use custom SVG mapping components, not raw Google Maps. If Google Maps is required, an API key integration is pending.

## Q. Alerts/SCADA requirements
- Currently mocked via business logic in `telemetry_service.py`. Real SCADA hardware integration is not required for the MVP.

## R. Testing status
- Basic `pytest` configuration could be added. Frontend relies on TypeScript compilation checks. No end-to-end (Playwright) tests exist yet.
