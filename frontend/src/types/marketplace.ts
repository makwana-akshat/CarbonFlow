export type MarketplaceMode = 'supply' | 'demand';

export type PhysicalState = 'Gas' | 'Liquefied' | 'All';

export interface PurityTierInfo {
  tierName: 'Liquefaction-ready' | 'Pipeline-ready' | 'EOR-ready' | 'Needs upgrade';
  variant: 'outline-success' | 'outline-warning' | 'neutral';
  threshold: number;
  nextTier?: string;
  upgradeCostPerTon?: number; // e.g. +₹420/t to reach Liquefaction
}

export interface SupplyListing {
  id: string;
  companyName: string;
  facilityType: string;
  isVerified: boolean;
  purity: number; // e.g. 98.7
  sourceType: 'Direct Air Capture' | 'Biogenic Fermentation' | 'Cement Flue Gas' | 'Fertilizer Plant' | 'Refinery Off-Gas';
  physicalState: 'Liquefied' | 'Gas';
  availableQuantity: number; // in tonnes
  pricePerTon: number; // in INR (₹)
  location: string;
  distanceKm: number;
  availabilityWindow: string; // e.g. "May 15 – Jun 30, 2026"
  captureCapacityAnnual: number;
  storagePressureBar: number;
  deliveryMethods: string[];
}

export interface DemandRequirement {
  id: string;
  buyerCompanyName: string;
  industry: string;
  application: string; // e.g. "Concrete Curing", "Fuel Synthesis", "Greenhouse", "Algae Farming", "EOR"
  quantityNeeded: number; // in tonnes
  minPurityRequired: number; // e.g. 97.5%
  maxPricePerTon: number; // in INR (₹)
  location: string;
  maxDistanceKm: number;
  requiredByDate: string; // e.g. "Jun 15, 2026"
  isUrgent?: boolean;
  offtakeFrequency: 'Immediate Spot' | 'Weekly ISO Tankers' | 'Continuous Pipeline';
}

export interface MarketplaceFilterState {
  searchQuery: string;
  minQuantity: number;
  maxQuantity: number;
  minPurity: number; // 0 to 100
  minPrice: number;
  maxPrice: number;
  maxDistance: number; // 0 to 500 km
  selectedApplications: string[];
  availability: string[];
  physicalState: PhysicalState;
  verifiedOnly: boolean;
  sortBy: 'purityDesc' | 'priceAsc' | 'priceDesc' | 'distanceAsc' | 'quantityDesc';
}
