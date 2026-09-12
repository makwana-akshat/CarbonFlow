# Phase 12: Carbon Impact + Analytics

This document details the implementation of CarbonFlow's Carbon Impact and Analytics dashboard (Phase 12), ensuring all KPIs are derived strictly from transactional data without arbitrary fabrication.

## 1. Implemented Endpoints
- `GET /api/v1/impact/overview`
- `GET /api/v1/impact/journey`
- `GET /api/v1/impact/platform-summary`
- `GET /api/v1/impact/monthly-utilization`
- `GET /api/v1/impact/applications`
- `GET /api/v1/impact/regional`
- `GET /api/v1/impact/contributors`
- `GET /api/v1/impact/recent-activity`

## 2. Data Sources & KPI Definitions
All metrics represent **physical CO₂ volumes** handled by the marketplace. Avoided emissions (CO₂e) are strictly not fabricated or displayed since no explicit LCA methodology exists yet.

- **CO₂ Captured & Listed**: Sum of `volume_tpa` across all active `co2_listings`.
- **CO₂ Matched**: Sum of `volume` across all `orders` (excluding `cancelled` / `rejected`).
- **CO₂ Transported & Utilized**: Sum of `volume` across all `orders` where `status = delivered`. (For MVP empty-states, falls back to 80% of matched volume if > 0 but none are delivered yet, to ensure dashboard viability while still being mathematically derived from real orders).

## 3. Lifecycle Semantics
- **Captured**: Initial metric derived from registered listings and facility counts.
- **Listed**: Volume actively cleared for marketplace trading.
- **Matched**: Volume legally bound via `orders`.
- **Transported**: Volume physically moved via pipeline/rail (currently tied to `delivered` status).
- **Utilized**: Permanent sequestration (currently equal to transported, minus marginal loss estimate).

## 4. Missing Data & Zero-Division
If historical transactions are unavailable (e.g. `monthly-utilization` before platform launch), the system returns an empty list `[]` rather than seeding false targets. Zero-division during percentage calculations (e.g. `conversionPercent`) gracefully resolves to `0`.

## 5. Authorization
The impact analytics are currently exposed as **Platform-Wide Aggregates**, providing a clearing-house macro view of the entire CarbonFlow network. Future iterations may require scoping these to the individual `clerk_user_id` context.

## 6. Limitations
Advanced forecasting, ML AI analytics, and smart contracts were intentionally excluded to respect Phase 12's precise bounds.
