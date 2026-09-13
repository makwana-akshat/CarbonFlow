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
  distanceKm?: number;
  costINR: number;
  timeHrs: number;
  emissionsTCO2e?: number;
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
export const REGIONS: RegionData[] = [
  {
    id: 'reg-ahmedabad',
    name: 'Ahmedabad Region',
    coords: { lat: 23.03, lng: 72.58 },
    polygon: [
      { lat: 23.5, lng: 72.0 }, { lat: 23.5, lng: 73.2 },
      { lat: 22.7, lng: 73.2 }, { lat: 22.7, lng: 72.0 },
    ],
    supply: { availableTonnes: 8200, activeSuppliers: 14, avgPurity: 98.4, avgPricePerTon: 4700 },
    demand: { totalDemandTonnes: 6500, activeBuyers: 21, fulfilledTonnes: 5300, unfulfilledTonnes: 1200 },
    price: { avgPricePerTon: 4700, lowestListing: 4350, highestListing: 5200, activeListings: 31 },
  },
  {
    id: 'reg-surat',
    name: 'Surat Region',
    coords: { lat: 21.17, lng: 72.83 },
    polygon: [
      { lat: 21.5, lng: 72.5 }, { lat: 21.5, lng: 73.2 },
      { lat: 20.8, lng: 73.2 }, { lat: 20.8, lng: 72.5 },
    ],
    supply: { availableTonnes: 22000, activeSuppliers: 8, avgPurity: 97.2, avgPricePerTon: 4200 },
    demand: { totalDemandTonnes: 8900, activeBuyers: 15, fulfilledTonnes: 7200, unfulfilledTonnes: 1700 },
    price: { avgPricePerTon: 4200, lowestListing: 3900, highestListing: 4650, activeListings: 22 },
  },
  {
    id: 'reg-jamnagar',
    name: 'Jamnagar Region',
    coords: { lat: 22.47, lng: 70.07 },
    polygon: [
      { lat: 22.8, lng: 69.5 }, { lat: 22.8, lng: 70.7 },
      { lat: 22.1, lng: 70.7 }, { lat: 22.1, lng: 69.5 },
    ],
    supply: { availableTonnes: 14700, activeSuppliers: 5, avgPurity: 98.0, avgPricePerTon: 4580 },
    demand: { totalDemandTonnes: 26400, activeBuyers: 6, fulfilledTonnes: 14000, unfulfilledTonnes: 12400 },
    price: { avgPricePerTon: 4580, lowestListing: 3950, highestListing: 5500, activeListings: 18 },
  },
  {
    id: 'reg-hazira',
    name: 'Hazira Industrial Cluster',
    coords: { lat: 21.11, lng: 72.65 },
    polygon: [
      { lat: 21.25, lng: 72.45 }, { lat: 21.25, lng: 72.85 },
      { lat: 20.95, lng: 72.85 }, { lat: 20.95, lng: 72.45 },
    ],
    supply: { availableTonnes: 18400, activeSuppliers: 6, avgPurity: 98.1, avgPricePerTon: 4350 },
    demand: { totalDemandTonnes: 11500, activeBuyers: 4, fulfilledTonnes: 9800, unfulfilledTonnes: 1700 },
    price: { avgPricePerTon: 4350, lowestListing: 4100, highestListing: 4900, activeListings: 14 },
  },
  {
    id: 'reg-mundra',
    name: 'Mundra Port Region',
    coords: { lat: 22.84, lng: 69.72 },
    polygon: [
      { lat: 23.1, lng: 69.3 }, { lat: 23.1, lng: 70.1 },
      { lat: 22.5, lng: 70.1 }, { lat: 22.5, lng: 69.3 },
    ],
    supply: { availableTonnes: 31000, activeSuppliers: 10, avgPurity: 97.8, avgPricePerTon: 4100 },
    demand: { totalDemandTonnes: 4800, activeBuyers: 8, fulfilledTonnes: 4200, unfulfilledTonnes: 600 },
    price: { avgPricePerTon: 4100, lowestListing: 3700, highestListing: 4700, activeListings: 26 },
  },
  {
    id: 'reg-mumbai',
    name: 'Mumbai Metropolitan',
    coords: { lat: 19.08, lng: 72.88 },
    polygon: [
      { lat: 19.35, lng: 72.6 }, { lat: 19.35, lng: 73.2 },
      { lat: 18.85, lng: 73.2 }, { lat: 18.85, lng: 72.6 },
    ],
    supply: { availableTonnes: 15600, activeSuppliers: 7, avgPurity: 98.4, avgPricePerTon: 4650 },
    demand: { totalDemandTonnes: 14200, activeBuyers: 19, fulfilledTonnes: 11000, unfulfilledTonnes: 3200 },
    price: { avgPricePerTon: 4650, lowestListing: 4200, highestListing: 5400, activeListings: 35 },
  },
  {
    id: 'reg-pune',
    name: 'Pune Region',
    coords: { lat: 18.52, lng: 73.86 },
    polygon: [
      { lat: 18.75, lng: 73.5 }, { lat: 18.75, lng: 74.2 },
      { lat: 18.25, lng: 74.2 }, { lat: 18.25, lng: 73.5 },
    ],
    supply: { availableTonnes: 4100, activeSuppliers: 3, avgPurity: 95.6, avgPricePerTon: 3700 },
    demand: { totalDemandTonnes: 9200, activeBuyers: 12, fulfilledTonnes: 4100, unfulfilledTonnes: 5100 },
    price: { avgPricePerTon: 3700, lowestListing: 3500, highestListing: 4100, activeListings: 9 },
  },
  {
    id: 'reg-chennai',
    name: 'Chennai Region',
    coords: { lat: 13.08, lng: 80.27 },
    polygon: [
      { lat: 13.35, lng: 79.9 }, { lat: 13.35, lng: 80.6 },
      { lat: 12.8, lng: 80.6 }, { lat: 12.8, lng: 79.9 },
    ],
    supply: { availableTonnes: 11200, activeSuppliers: 4, avgPurity: 96.9, avgPricePerTon: 4000 },
    demand: { totalDemandTonnes: 16800, activeBuyers: 9, fulfilledTonnes: 11000, unfulfilledTonnes: 5800 },
    price: { avgPricePerTon: 4000, lowestListing: 3600, highestListing: 4600, activeListings: 19 },
  },
];
