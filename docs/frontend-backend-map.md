# Frontend-Backend Implementation Map

## 1. Route Analysis & API Mapping

| Frontend Page | Purpose | Data Needed | API Required | Database Tables | Status |
| ------------- | ------- | ----------- | ------------ | --------------- | ------ |
| **Landing** (`/`) | Public overview | System status, auth states | `GET /api/v1/health` | - | Done |
| **Auth** (`/login`, `/signup`) | Authentication | Clerk integration | `POST /api/v1/users/sync` | `users` | Done |
| **Dashboard Overview** (`/dashboard/overview`) | High-level summary | KPIs, market prices, supply/demand charts, AI Insights | `GET /api/v1/dashboard/summary` | `kpi_metrics`, `market_prices`, `ai_insights` | Pending |
| **Marketplace** (`/dashboard/marketplace`) | CO₂ listings & requests | Listings, buyer requests, filters | `GET /api/v1/marketplace/listings` | `co2_listings`, `co2_requests` | Pending |
| **Requirements** (`/dashboard/requirements`) | Buyer specifications | Requirements list | `GET /api/v1/requirements` | `co2_requests` | Pending |
| **Recommendations** (`/dashboard/recommendations`) | Matches | Offtake recommendations | `GET /api/v1/recommendations/matches` | `users`, `co2_listings`, `co2_requests` | Pending |
| **Orders** (`/dashboard/orders`) | Active offtake tracking | Active shipments, pipeline telemetry | `GET /api/v1/orders/active` | `orders`, `logistics_routes` | Pending |
| **Logistics** (`/dashboard/logistics`) | Route planning & mapping | Eligible modes, routing | `GET /api/v1/logistics/routes` | `logistics_routes`, `facilities` | Pending |
| **Carbon Impact** (`/app/carbon-impact`) | ESG reporting | CO2 captured, reduction stats | `GET /api/v1/impact/summary` | `impact_metrics`, `orders` | Pending |
| **Alerts & SCADA** (`/app/alerts`) | Network telemetry | Active warnings, facility statuses | `GET /api/v1/telemetry/alerts` | `alerts`, `facility_status` | Pending |
| **Audit Contracts** (`/app/audit-contracts`) | Blockchain/Legal clearing | Escrow status, audit timelines | `GET /api/v1/contracts/audit` | `contracts`, `contract_versions` | Pending |
| **Maps** (`/dashboard/maps`) | Geospatial view | Suppliers, buyers, routes, heatmaps | `GET /api/v1/maps/locations` | `facilities`, `orders` | Pending |

---

## 2. Mock Data Inventory

| Component / Page | Current Mock Data File | Required Real API | Database Source |
| ---------------- | ---------------------- | ----------------- | --------------- |
| `DashboardContent` | `mockData.ts` (`KPI_DATA`, `MARKET_PRICE_DATA`, `SUPPLY_DEMAND_DATA`) | `GET /api/v1/dashboard/summary` | Views aggregating `orders` and `co2_listings` |
| `RecommendedMatches` | `mockData.ts` (`RECOMMENDATIONS_DATA`) | `GET /api/v1/recommendations/matches` | Matchmaking AI / SQL View |
| `DashboardPage` (Orders Tab) | Hardcoded array in `CarbonFlowShell.tsx` (`[ORD-8921, ...]`) | `GET /api/v1/orders/active` | `orders`, `logistics_routes` |
| `MarketplaceView` | `marketplaceData.ts` (`MARKETPLACE_LISTINGS`) | `GET /api/v1/marketplace/listings` | `co2_listings` |
| `MyRequirementsView` | `marketplaceData.ts` (`MY_REQUIREMENTS`) | `GET /api/v1/requirements` | `co2_requests` |
| `LogisticsRoutePlanning` | `mockShipments.ts` (`SAMPLE_SHIPMENTS`) | `GET /api/v1/logistics/routes` | `logistics_routes`, `facilities` |
| `CarbonImpactPage` | `carbonImpactMock.ts` (`BASE_REGIONAL_IMPACT`, etc.) | `GET /api/v1/impact/summary` | `impact_metrics`, `orders` |
| `AlertsPage` | `alertsMock.ts` (`ACTIVE_ALERTS`, `FACILITY_MONITORING_DATA`) | `GET /api/v1/telemetry/alerts` | `alerts`, `facility_status` |
| `AuditContractsPage`| `auditContractsMock.ts` (`AUDIT_CONTRACTS`) | `GET /api/v1/contracts/audit` | `contracts` |
| `MapsPage` | `mapsMockData.ts` (`SUPPLIER_LOCATIONS`, `BUYER_LOCATIONS`) | `GET /api/v1/maps/locations` | `facilities` |
| `AssistantWidget` | `AssistantDialog.tsx` (Hardcoded string generator) | `POST /api/v1/assistant/chat` | AI LLM Integration |

---

## 3. Database Gap Analysis

The current database only contains the `users` table. Based on the frontend UI requirements, the following tables are required to make the application functional.

### Table: `co2_listings`
* **Why required**: Populates the Marketplace tab for buyers and tracks supplier available inventory.
* **Fields**: `id` (UUID), `supplier_id` (UUID, FK to users), `facility_name` (TEXT), `co2_grade` (TEXT), `volume_tpa` (NUMERIC), `price_per_ton` (NUMERIC), `purity_percentage` (NUMERIC), `transport_modes` (TEXT[]), `status` (TEXT), `created_at`, `updated_at`.
* **Relationships**: `supplier_id` -> `users.id`.
* **Indexes**: Index on `supplier_id`, `status`, and `co2_grade`.
* **Constraints**: `volume_tpa` > 0, `price_per_ton` >= 0, `status` IN ('active', 'draft', 'fulfilled').

### Table: `co2_requests`
* **Why required**: Populates the "My Requirements" tab for buyers and allows suppliers to find demand.
* **Fields**: `id` (UUID), `buyer_id` (UUID, FK to users), `required_grade` (TEXT), `volume_needed` (NUMERIC), `target_price` (NUMERIC), `status` (TEXT), `created_at`, `updated_at`.
* **Relationships**: `buyer_id` -> `users.id`.
* **Indexes**: Index on `buyer_id`, `status`.

### Table: `facilities`
* **Why required**: Required for the Geospatial Maps, Logistics Routing, and Telemetry SCADA monitoring.
* **Fields**: `id` (UUID), `owner_id` (UUID, FK to users), `name` (TEXT), `type` (TEXT), `latitude` (NUMERIC), `longitude` (NUMERIC), `region` (TEXT), `operational_status` (TEXT).
* **Relationships**: `owner_id` -> `users.id`.
* **Indexes**: Geospatial/PostGIS index on coordinates (or standard index on lat/lon), index on `owner_id`.

### Table: `orders` (Offtake Agreements)
* **Why required**: Feeds the Orders tab, Audit Contracts, and Carbon Impact historical reporting.
* **Fields**: `id` (UUID), `buyer_id` (UUID), `supplier_id` (UUID), `listing_id` (UUID), `volume` (NUMERIC), `total_value` (NUMERIC), `status` (TEXT), `transport_mode` (TEXT), `eta` (TIMESTAMPTZ), `created_at`, `updated_at`.
* **Relationships**: `buyer_id` -> `users.id`, `supplier_id` -> `users.id`, `listing_id` -> `co2_listings.id`.
* **Indexes**: Indexes on `buyer_id`, `supplier_id`, `status`.

### Table: `alerts`
* **Why required**: Populates the SCADA Alerts monitoring tab.
* **Fields**: `id` (UUID), `facility_id` (UUID), `severity` (TEXT), `title` (TEXT), `description` (TEXT), `is_resolved` (BOOLEAN), `created_at`.
* **Relationships**: `facility_id` -> `facilities.id`.
* **Indexes**: Index on `facility_id`, `is_resolved`, `severity`.
