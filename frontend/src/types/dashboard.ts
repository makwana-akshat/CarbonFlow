export type UserRole = 'buyer' | 'supplier' | 'admin';

export type DashboardState = 'success' | 'loading' | 'empty' | 'error';

export type TabId = 'overview' | 'marketplace' | 'recommendations' | 'orders' | 'logistics' | 'maps' | 'ui-gallery' | 'requirements';

export interface TabItem {
  id: TabId;
  label: string;
  hasDropdown?: boolean;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  trend: {
    value: string;
    isPositive: boolean;
  };
  period: string;
}

export interface RouteStep {
  iconType: 'capture' | 'cryo' | 'rail' | 'truck' | 'pipeline' | 'terminal';
  label: string;
}

export interface RecommendationItem {
  id: string;
  companyName: string;
  facilityType: string;
  location: string;
  matchScore: number;
  isBestMatch: boolean;
  isVerified: boolean;
  tags: string[];
  co2Grade: string;
  volume: string;
  pricePerTon: string;
  routeSteps: RouteStep[];
  purity: string;
  deliveryTimeline: string;
  certification: string;
  co2Source: 'DAC' | 'Biogenic' | 'Point-Source Capture';
  transportMode: 'Pipeline' | 'ISO Rail Tanker' | 'Cryogenic Truck' | 'Barge';
}

export interface MarketPricePoint {
  month: string;
  price: number;
  benchmark: number;
  isSelected?: boolean;
}

export interface SupplyDemandPoint {
  month: string;
  supply: number;
  demand: number;
  isSelected?: boolean;
}

export interface AlertItem {
  id: string;
  type: 'warning' | 'danger' | 'success';
  title: string;
  description: string;
  timestamp: string;
  actionText?: string;
}

export interface AiInsight {
  role: UserRole;
  headline: string;
  insight: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface FilterState {
  searchQuery: string;
  activeChip: string | null;
  grade: string;
  source: string;
  verifiedOnly: boolean;
  sortBy: 'match' | 'priceAsc' | 'priceDesc' | 'volumeDesc';
}
