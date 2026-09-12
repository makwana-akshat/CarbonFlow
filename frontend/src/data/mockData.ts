import type {
  UserRole,
  KpiMetric,
  RecommendationItem,
  MarketPricePoint,
  SupplyDemandPoint,
  AlertItem,
  AiInsight,
  TabItem
} from '../types/dashboard';

export const NAVIGATION_TABS: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'marketplace', label: 'Marketplace', hasDropdown: true },
  { id: 'recommendations', label: 'Recommendations' },
  { id: 'orders', label: 'Orders', hasDropdown: true },
  { id: 'logistics', label: 'Logistics' },
  { id: 'settings', label: 'Settings' },
];

export const SEARCH_CATEGORY_CHIPS = [
  { id: 'all', label: 'All Segments' },
  { id: 'dac', label: 'DAC (Direct Air Capture)' },
  { id: 'biogenic', label: 'Biogenic CO₂' },
  { id: 'food-grade', label: 'Food-Grade (E290)' },
  { id: 'pipeline', label: 'Pipeline Interconnect' },
  { id: 'rail-tanker', label: 'ISO Rail Tanker' },
];

export const KPI_DATA: Record<UserRole, KpiMetric[]> = {
  buyer: [
    {
      id: 'co2-req',
      label: 'CO₂ Required',
      value: '24,500 t',
      trend: { value: '+8.2%', isPositive: true },
      period: 'vs last month'
    },
    {
      id: 'contract-coverage',
      label: 'Contract Coverage',
      value: '88.4%',
      trend: { value: '+4.1%', isPositive: true },
      period: 'secured until Q4'
    },
    {
      id: 'avg-purity',
      label: 'Weighted Purity',
      value: '99.94%',
      trend: { value: 'Spec OK', isPositive: true },
      period: 'continuous assay'
    },
    {
      id: 'net-negative-cost',
      label: 'Weighted Price',
      value: '$38.40/t',
      trend: { value: '-2.4%', isPositive: true },
      period: 'vs spot benchmark'
    }
  ],
  supplier: [
    {
      id: 'capture-yield',
      label: 'Active Capture Rate',
      value: '18,200 t/mo',
      trend: { value: '+12.5%', isPositive: true },
      period: 'nameplate 92%'
    },
    {
      id: 'offtake-committed',
      label: 'Committed Offtake',
      value: '94.2%',
      trend: { value: '+6.0%', isPositive: true },
      period: 'forward contracts'
    },
    {
      id: 'liquefaction-uptime',
      label: 'Cryo-Loop Uptime',
      value: '99.7%',
      trend: { value: 'Optimal', isPositive: true },
      period: '30-day telemetry'
    },
    {
      id: 'realized-clearing-price',
      label: 'Realized Net Price',
      value: '$41.80/t',
      trend: { value: '+3.1%', isPositive: true },
      period: 'blended FOB'
    }
  ],
  admin: [
    {
      id: 'platform-cleared-volume',
      label: 'Total Volume Cleared',
      value: '142,800 t',
      trend: { value: '+18.4%', isPositive: true },
      period: 'trailing 30 days'
    },
    {
      id: 'active-intermodal-routes',
      label: 'Active Dispatched Routes',
      value: '34 Units',
      trend: { value: '4 Modes', isPositive: true },
      period: 'live GPS SCADA'
    },
    {
      id: 'cross-border-settlement',
      label: 'Smart Contract Escrow',
      value: '$5.48M',
      trend: { value: '100% Cleared', isPositive: true },
      period: 'instant release'
    },
    {
      id: 'compliance-audits',
      label: 'Verified MRV Filings',
      value: '100%',
      trend: { value: 'ISO 14064-2', isPositive: true },
      period: 'zero non-conformity'
    }
  ]
};



export const MARKET_PRICE_DATA: MarketPricePoint[] = [
  { month: 'Oct', price: 34.2, benchmark: 35.0 },
  { month: 'Nov', price: 35.8, benchmark: 36.1 },
  { month: 'Dec', price: 37.4, benchmark: 36.8 },
  { month: 'Jan', price: 39.0, benchmark: 38.0 },
  { month: 'Feb', price: 38.5, benchmark: 38.9 },
  { month: 'Mar', price: 40.2, benchmark: 40.0 },
  { month: 'Apr', price: 41.0, benchmark: 40.8 },
  { month: 'May', price: 41.8, benchmark: 41.2, isSelected: true },
];

export const SUPPLY_DEMAND_DATA: SupplyDemandPoint[] = [
  { month: 'Oct', supply: 38, demand: 42 },
  { month: 'Nov', supply: 42, demand: 45 },
  { month: 'Dec', supply: 45, demand: 51 },
  { month: 'Jan', supply: 52, demand: 54 },
  { month: 'Feb', supply: 55, demand: 58 },
  { month: 'Mar', supply: 61, demand: 66 },
  { month: 'Apr', supply: 67, demand: 71 },
  { month: 'May', supply: 72, demand: 79, isSelected: true },
];

export const ALERTS_DATA: AlertItem[] = [
  {
    id: 'alt-1',
    type: 'warning',
    title: 'Price Spike Alert: Gulf Coast pipeline tariff update',
    description: 'Regional compression power surcharge adding +$2.10/t across Zone 3 feeder lines effective next Monday.',
    timestamp: '14 min ago',
    actionText: 'Review Tariffs'
  },
  {
    id: 'alt-2',
    type: 'danger',
    title: 'Supply Shortage Risk: Rotterdam liquefaction terminal valve repair',
    description: 'Unscheduled chiller service will curtail spot liquefaction by 12,500 t between May 18-22.',
    timestamp: '1h ago',
    actionText: 'Re-route Rail'
  },
  {
    id: 'alt-3',
    type: 'success',
    title: 'Verification Complete: DAC Facility #4 ISO-14064 direct audit approved',
    description: 'Third-party auditor Bureau Veritas registered 34,000 t of net-negative direct air capture credits.',
    timestamp: '3h ago',
    actionText: 'Download Cert'
  }
];

export const AI_INSIGHTS: Record<UserRole, AiInsight> = {
  buyer: {
    role: 'buyer',
    headline: 'AI Route & Offtake Optimization',
    insight: 'Consolidating Midwest DAC batch #408 with existing rail tankers can reduce total Scope 3 freight emissions by 14.8% and save $3.20/t.',
    primaryCta: 'Apply Route Shift',
    secondaryCta: 'View Carbon Accounting'
  },
  supplier: {
    role: 'supplier',
    headline: 'AI Dynamic Yield & Offtake Match',
    insight: 'Regional demand for food-grade liquid CO₂ in the Rhine-Ruhr Corridor is up 23%; adjusting spot listing #CL-92 could yield an extra $4.10/t margin.',
    primaryCta: 'Adjust Listing Price',
    secondaryCta: 'View Buyer Inquiries'
  },
  admin: {
    role: 'admin',
    headline: 'System Grid Liquidity Advisory',
    insight: 'Intermodal rail buffer at Duisburg Terminal is operating at 88% capacity; releasing 6,000 t pipeline contracts balances the regional network.',
    primaryCta: 'Rebalance Pipeline',
    secondaryCta: 'Audit Network Nodes'
  }
};
