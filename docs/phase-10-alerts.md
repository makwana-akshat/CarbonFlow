# Phase 10: Alerts & SCADA Monitoring

## Overview
Phase 10 introduces the operational monitoring layer for CarbonFlow. It transforms the existing static frontend Alerts & SCADA dashboard into a fully functional, data-driven operational monitoring system without requiring schema changes.

## Backend Implementation

### Service Architecture
A dedicated `MonitoringService` (`backend/app/services/monitoring_service.py`) was introduced to encapsulate the business logic for rule evaluation. It exposes methods for:
- `evaluate_facilities()`: Lazily evaluates `captureOutput` vs `expectedOutput` using pseudo-SCADA data and generates actionable alerts if thresholds (e.g. 5% variance for warning, 10% for critical) are breached.
- `evaluate_shipments()`: Monitors active logistics tracking ETA thresholds and triggers alerts for delayed convoys.
- Alert Management: `acknowledge_alert` and `resolve_alert`.
- Operational summaries and histories.

### Schema Constraints Handling
Since direct DDL on the Supabase schema was restricted, the system cleverly leverages the `description` column of the `alerts` table to persist complex operational metadata via serialized JSON. The API transparently deserializes this payload and maps it into the `extra_fields` property required by the frontend components.

### REST API Endpoints
The `telemetry.py` API router exposes:
- `GET /api/v1/telemetry/alerts`: Active alerts.
- `GET /api/v1/telemetry/alerts/history`: Resolved alerts.
- `GET /api/v1/telemetry/alerts/summary`: KPI summary metrics.
- `POST /api/v1/telemetry/alerts/{alert_id}/acknowledge`: Acknowledges an alert.
- `POST /api/v1/telemetry/alerts/{alert_id}/resolve`: Resolves an alert.
- `GET /api/v1/telemetry/facilities/monitoring`: Live facility operational states.
- `GET /api/v1/telemetry/shipments/monitoring`: Live logistics convoy tracking states.

## Frontend Integration
The frontend components originally powered by static mock datasets in `alertsMock.ts` were modernized to support real-time state hydration via API polling (or explicit refresh).
- Data hooks dynamically inject props to `FacilityMonitoringTable`, `ShipmentMonitoringTable`, `AlertHistoryFeed`, and `OperationalSummaryBar`.
- The `AlertDetailDrawer` was expanded to provide interactive resolution functionality, seamlessly updating both the frontend UI and the backend Postgres datastore upon user action.

## Next Steps
- Real SCADA IoT integration using MQTT brokers instead of pseudo-SCADA generation.
- WebSocket-based real-time telemetry streaming rather than HTTP polling.
