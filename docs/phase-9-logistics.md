# Phase 9: Logistics and Route Planning

## Overview
Phase 9 transitions the CarbonFlow platform's mapping and logistics capabilities from mock data to real backend-driven functionality. The frontend `MapsPage` and `LogisticsRoutePlanning` components now dynamically fetch data utilizing authenticated API calls, ensuring a unified state between the marketplace and geographic visualization.

## Key Changes
1. **Dynamic Coordinates System**: 
   - Since Supabase credentials for raw SQL execution are restricted in this environment, a fallback geographic translation system was implemented in `map_service.py` and `logistics_service.py`. 
   - City and region names (e.g., Ahmedabad, Surat, Jamnagar) are automatically parsed into `GeoPoint` coordinates upon data retrieval.
2. **Logistics Service**: 
   - Implemented a deterministic Haversine route calculation engine for dynamic routing.
   - Outputs pipeline and cryogenic truck options dynamically based on the requested CO₂ volume and purity.
3. **Frontend API Integration**: 
   - Restructured `mapService.ts` to export decoupled fetchers (`fetchSuppliers`, `fetchBuyers`, `fetchRoutes`) while maintaining pure functional filtering parameters.
   - `MapsPage.tsx` was converted to load data asynchronously, leveraging React's `useEffect` and `Promise.all()` to gather the total geographic scope before rendering map nodes.
4. **Data Seed**: 
   - Introduced `seed_maps.py` to seed baseline coordinates directly via the Supabase PostgREST Python client.

## Validated Components
- Maps display now correlates with the actual `co2_listings` and `co2_requests` database tables.
- Logistics routes respond deterministically to real distance variables via API `GET /api/v1/logistics/calculate-route`.
