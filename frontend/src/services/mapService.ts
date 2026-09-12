/**
 * mapService — Data querying, filtering, and geolocation helpers for CarbonFlow Maps.
 * All business logic for filtering entities is centralized here, keeping components pure.
 * Future: replace mock imports with API calls to GET /api/v1/map/*
 */

import {
  SUPPLIERS,
  BUYERS,
  FACILITIES,
  ROUTES,
  REGIONS,
  CARBON_FLOW_EDGES,
} from '../data/mapsMockData';
import type {
  SupplierNode,
  BuyerNode,
  FacilityNode,
  RouteData,
  RegionData,
  CarbonFlowEdge,
  MapFilterState,
  GeoPoint,
} from '../types/maps';

// ─── Supplier Queries ─────────────────────────────────────────────────────────

export function getSuppliers(filters: MapFilterState, searchQuery: string): SupplierNode[] {
  return SUPPLIERS.filter((s) => {
    if (filters.region && !s.location.toLowerCase().includes(filters.region.toLowerCase())) return false;
    if (filters.industry && s.industry.toLowerCase() !== filters.industry.toLowerCase()) return false;
    if (s.purity < filters.minPurity) return false;
    if (s.availableTonnes < filters.minQuantity) return false;
    if (s.pricePerTon > filters.maxPrice) return false;
    if (filters.verifiedOnly && !s.verified) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.industry.toLowerCase().includes(q) ||
        s.facilityType.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

// ─── Buyer Queries ────────────────────────────────────────────────────────────

export function getBuyers(filters: MapFilterState, searchQuery: string): BuyerNode[] {
  return BUYERS.filter((b) => {
    if (filters.region && !b.location.toLowerCase().includes(filters.region.toLowerCase())) return false;
    if (filters.application && b.application.toLowerCase() !== filters.application.toLowerCase()) return false;
    if (b.minPurity < filters.minPurity) return false;
    if (filters.verifiedOnly && !b.verified) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.organisation.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.application.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

// ─── Facility Queries ─────────────────────────────────────────────────────────

export function getFacilities(_filters: MapFilterState, searchQuery: string): FacilityNode[] {
  return FACILITIES.filter((f) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.operator.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

// ─── Route Queries ────────────────────────────────────────────────────────────

export function getRoutes(filters: MapFilterState, searchQuery: string): RouteData[] {
  return ROUTES.filter((r) => {
    if (r.distanceKm > filters.maxDistance) return false;
    if (r.estimatedCostINR > filters.maxTransportCost) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.supplierName.toLowerCase().includes(q) ||
        r.buyerName.toLowerCase().includes(q) ||
        r.transportMode.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

// ─── Region Queries ───────────────────────────────────────────────────────────

export function getRegions(filters: MapFilterState): RegionData[] {
  if (!filters.region) return REGIONS;
  return REGIONS.filter((r) => r.name.toLowerCase().includes(filters.region.toLowerCase()));
}

// ─── Carbon Flow Queries ──────────────────────────────────────────────────────

export function getCarbonFlows(): CarbonFlowEdge[] {
  return CARBON_FLOW_EDGES;
}

// ─── Search across all entities ───────────────────────────────────────────────

export interface SearchResult {
  id: string;
  label: string;
  subtitle: string;
  type: 'supplier' | 'buyer' | 'facility' | 'region';
  coords: GeoPoint;
}

export function searchEntities(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const s of SUPPLIERS) {
    if (s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)) {
      results.push({ id: s.id, label: s.name, subtitle: s.location, type: 'supplier', coords: s.coords });
    }
  }
  for (const b of BUYERS) {
    if (b.name.toLowerCase().includes(q) || b.location.toLowerCase().includes(q) || b.organisation.toLowerCase().includes(q)) {
      results.push({ id: b.id, label: b.name, subtitle: b.location, type: 'buyer', coords: b.coords });
    }
  }
  for (const f of FACILITIES) {
    if (f.name.toLowerCase().includes(q) || f.location.toLowerCase().includes(q)) {
      results.push({ id: f.id, label: f.name, subtitle: f.location, type: 'facility', coords: f.coords });
    }
  }
  for (const r of REGIONS) {
    if (r.name.toLowerCase().includes(q)) {
      results.push({ id: r.id, label: r.name, subtitle: `${r.supply.activeSuppliers} suppliers`, type: 'region', coords: r.coords });
    }
  }

  return results.slice(0, 10);
}

// ─── Geo utility ──────────────────────────────────────────────────────────────

/** Haversine distance between two GeoPoints in km */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}
