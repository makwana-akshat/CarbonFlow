export type ShipmentStatus = 'scheduled' | 'in-transit' | 'delivered' | 'utilized';

export type TransportModeId = 'pipeline' | 'truck' | 'onsite';

export interface LocationPoint {
  name: string;
  facility: string;
  city: string;
  state: string;
  coordinates: [number, number]; // [lat, lng]
}

export interface Shipment {
  id: string;
  emitterLocation: LocationPoint;
  buyerLocation: LocationPoint;
  volume: number; // in tonnes
  purity: number; // in percentage, e.g. 98.4
  physicalState: 'gas' | 'liquefied';
  status: ShipmentStatus;
  scheduledDispatch?: string;
  orderRef?: string;
}

export interface RouteOption {
  id: string;
  name: string;
  routeCode: string;
  viaDescription: string;
  distanceKm: number;
  estimatedTime: string;
  transportCostINR: number;
  transportEmissionsTons: number; // e.g. 0.034
  isRecommended: boolean;
  transitProgressPercent?: number; // 0 to 100 for in-transit
  modeId: TransportModeId;
  waypoints: [number, number][]; // lat/lng path coordinates for map projection
  safetyLevel?: 'ISO 27913 Compliant' | 'Direct Offtake' | 'Hazmat Certified';
}

export interface ModeEligibility {
  modeId: TransportModeId;
  name: string;
  subtitle: string;
  iconType: 'pipeline' | 'truck' | 'onsite';
  isEligible: boolean;
  ineligibilityReason?: string;
  isRecommended: boolean;
  estimatedBaseCostPerTon: number;
  standardMinPurity: number;
  requiresState?: 'gas' | 'liquefied';
}

export const TYPES_LOADED = true;
