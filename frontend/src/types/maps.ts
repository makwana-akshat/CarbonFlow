// All TypeScript interfaces for the CarbonFlow Maps feature.
// Supports Google Maps engine via @vis.gl/react-google-maps.

export type MapMode =
  | 'marketplace'
  | 'routes'
  | 'supply'
  | 'demand'
  | 'price'
  | 'carbon-flow';

export interface GeoPoint {
  /** Latitude in decimal degrees */
  lat: number;
  /** Longitude in decimal degrees */
  lng: number;
}

// ─── Entities ────────────────────────────────────────────────────────────────

export interface SupplierNode {
  id: string;
  name: string;
  verified: boolean;
  location: string;
  coords: GeoPoint;
  facilityType: string;
  availableTonnes: number;
  purity: number;               // 90-100 %
  pricePerTon: number;          // ₹
  physicalState: 'Liquefied' | 'Compressed' | 'Gas';
  dispatchWindow: string;       // e.g. "Immediate" | "Within 7 days"
  co2Source: 'DAC' | 'Biogenic' | 'Point-Source Capture';
  industry: string;
  distanceKm?: number;
}

export interface BuyerNode {
  id: string;
  name: string;
  verified: boolean;
  location: string;
  coords: GeoPoint;
  organisation: string;
  requiredTonnes: number;
  minPurity: number;            // minimum acceptable %
  maxBudgetPerTon: number;      // ₹
  application: string;          // e.g. "Urea Synthesis", "EOR", "Food-Grade"
  urgency: 'Immediate' | 'Within 30 days' | 'Flexible';
  activeRequirements: number;
}

export interface FacilityNode {
  id: string;
  name: string;
  type: 'capture-hub' | 'terminal' | 'liquefaction' | 'pipeline-head';
  location: string;
  coords: GeoPoint;
  capacityTonnesYear: number;
  operator: string;
  status: 'Operational' | 'Commissioning' | 'Planned';
}

export interface RouteAlternative {
  label: string;
  distanceKm: number;
  costINR: number;
  timeHrs: number;
  emissionsTCO2e: number;
}

export interface RouteData {
  id: string;
  supplierId: string;
  buyerId: string;
  supplierName: string;
  buyerName: string;
  fromCoords: GeoPoint;
  toCoords: GeoPoint;
  distanceKm: number;
  travelTimeHrs: number;
  estimatedCostINR: number;
  transportMode: 'Road' | 'Rail' | 'Pipeline' | 'Barge';
  isRecommended: boolean;
  emissionsTCO2e?: number;
  reliabilityScore?: number;
  geometry?: GeoPoint[];
  alternatives?: RouteAlternative[];
}

export interface RegionData {
  id: string;
  name: string;
  coords: GeoPoint;   // centroid for label/camera placement
  /** Polygon defining the regional cluster boundary */
  polygon: GeoPoint[];
  supply: {
    availableTonnes: number;
    activeSuppliers: number;
    avgPurity: number;
    avgPricePerTon: number;
  };
  demand: {
    totalDemandTonnes: number;
    activeBuyers: number;
    fulfilledTonnes: number;
    unfulfilledTonnes: number;
  };
  price: {
    avgPricePerTon: number;
    lowestListing: number;
    highestListing: number;
    activeListings: number;
  };
}

export interface CarbonFlowEdge {
  id: string;
  supplierId: string;
  buyerId: string;
  supplierName: string;
  buyerName: string;
  fromCoords: GeoPoint;
  toCoords: GeoPoint;
  /** Tonnes/year — used to scale line thickness */
  annualVolumeTonnes: number;
  isActive: boolean;
  estimatedDistanceKm?: number;
}

// ─── Selected Entity (for detail panel) ──────────────────────────────────────

export type SelectedEntity =
  | { type: 'supplier'; data: SupplierNode }
  | { type: 'buyer'; data: BuyerNode }
  | { type: 'facility'; data: FacilityNode }
  | { type: 'route'; data: RouteData }
  | { type: 'region'; data: RegionData; subMode: 'supply' | 'demand' | 'price' }
  | { type: 'flow'; data: CarbonFlowEdge };

// ─── Map Filter State ─────────────────────────────────────────────────────────

export interface MapFilterState {
  region: string;           // '' = all
  industry: string;         // '' = all
  minPurity: number;
  minQuantity: number;
  maxPrice: number;
  verifiedOnly: boolean;
  maxDistance: number;      // km, for route mode
  maxTransportCost: number; // ₹, for route mode
  application: string;      // '' = all, for demand mode
}

export const DEFAULT_MAP_FILTERS: MapFilterState = {
  region: '',
  industry: '',
  minPurity: 90,
  minQuantity: 0,
  maxPrice: 10000,
  verifiedOnly: false,
  maxDistance: 1000,
  maxTransportCost: 200000,
  application: '',
};

// ─── Map Viewport & Bounds ───────────────────────────────────────────────────

export interface MapViewport {
  center: GeoPoint;
  zoom: number;
}

/** Default India industrial center */
export const DEFAULT_MAP_CENTER: GeoPoint = {
  lat: 21.7679,
  lng: 73.0,
};

export const DEFAULT_MAP_ZOOM = 6.5;

/** India bounding box */
export const INDIA_BOUNDS = {
  minLat: 6.5,
  maxLat: 37.6,
  minLng: 68.1,
  maxLng: 97.4,
};
