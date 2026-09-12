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
  { id: 'ui-gallery', label: 'UI Kit Gallery' },
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
      id: 'rec-suppliers',
      label: 'Recommended Suppliers',
      value: '14',
      trend: { value: '+3 new', isPositive: true },
      period: 'verified matches'
    },
    {
      id: 'active-orders',
      label: 'Active Orders',
      value: '6',
      trend: { value: '2 in transit', isPositive: true },
      period: 'ISO rail tankers'
    },
    {
      id: 'avg-cost',
      label: 'Avg Procurement Cost',
      value: '$41.80/t',
      trend: { value: '-4.5%', isPositive: true },
      period: 'below index avg'
    }
  ],
  supplier: [
    {
      id: 'available-co2',
      label: 'Available CO₂',
      value: '68,200 t',
      trend: { value: '+12.4%', isPositive: true },
      period: 'capture rate'
    },
    {
      id: 'active-listings',
      label: 'Active Listings',
      value: '9',
      trend: { value: '+2 this week', isPositive: true },
      period: 'spot & contracts'
    },
    {
      id: 'buyer-requests',
      label: 'Buyer Requests',
      value: '28',
      trend: { value: '+18.2%', isPositive: true },
      period: 'pending offtakes'
    },
    {
      id: 'co2-sold',
      label: 'CO₂ Sold YTD',
      value: '142,800 t',
      trend: { value: '+21.6%', isPositive: true },
      period: 'YoY contracted'
    }
  ],
  admin: [
    {
      id: 'volume-traded',
      label: 'Total Volume Traded',
      value: '412,900 t',
      trend: { value: '+16.8%', isPositive: true },
      period: 'MoM marketplace vol'
    },
    {
      id: 'participants',
      label: 'Active Participants',
      value: '184',
      trend: { value: '+14 verified', isPositive: true },
      period: 'suppliers & buyers'
    },
    {
      id: 'pipeline-liquidity',
      label: 'Pipeline Liquidity',
      value: '$17.2M',
      trend: { value: '+9.4%', isPositive: true },
      period: 'escrow contracted'
    },
    {
      id: 'compliance-index',
      label: 'Compliance Index',
      value: '99.4%',
      trend: { value: '+0.3%', isPositive: true },
      period: 'ISO-14064 verified'
    }
  ]
};

export const RECOMMENDATIONS_DATA: Record<UserRole, RecommendationItem[]> = {
  buyer: [
    {
      id: 'rec-1',
      companyName: 'Nordic Cryo Carbon A/S',
      facilityType: 'Direct Air Capture & Liquefaction Facility #2',
      location: 'Rotterdam Europort Terminal, NL',
      matchScore: 98.4,
      isBestMatch: true,
      isVerified: true,
      tags: ['Food Grade E290', 'Low Carbon Intensity', 'Immediate Offtake'],
      co2Grade: 'Food/Beverage Grade 99.98%',
      volume: '8,500 t/mo',
      pricePerTon: '$39.20/t',
      co2Source: 'DAC',
      transportMode: 'ISO Rail Tanker',
      purity: '99.98% (Dry basis, <2 ppm H2O)',
      deliveryTimeline: '18h direct rail dispatch',
      certification: 'ISO 14064-2 / RED II Verified',
      routeSteps: [
        { iconType: 'capture', label: 'DAC Array Alpha' },
        { iconType: 'cryo', label: 'Cryo-Compressor (-28°C)' },
        { iconType: 'rail', label: 'Dedicated ISO Rail' },
        { iconType: 'terminal', label: 'Buyer Storage Silo' }
      ]
    },
    {
      id: 'rec-2',
      companyName: 'AeroCapture Synthetics GmbH',
      facilityType: 'Biogenic Fermentation & Pure Gas Capture Plant',
      location: 'Antwerp Logistics Hub, BE',
      matchScore: 94.1,
      isBestMatch: false,
      isVerified: true,
      tags: ['Biogenic Zero-Scope 1', 'Pipeline Connected'],
      co2Grade: 'Industrial Tech Grade 99.9%',
      volume: '14,200 t/mo',
      pricePerTon: '$36.80/t',
      co2Source: 'Biogenic',
      transportMode: 'Pipeline',
      purity: '99.90% (<10 ppm hydrocarbons)',
      deliveryTimeline: 'Continuous 40 bar pipeline',
      certification: 'ISCC PLUS Certified',
      routeSteps: [
        { iconType: 'capture', label: 'Fermenter Off-Gas' },
        { iconType: 'pipeline', label: 'Regional Trunkline 4' },
        { iconType: 'terminal', label: 'Metering Station 12' }
      ]
    },
    {
      id: 'rec-3',
      companyName: 'Veritas Carbon Terminals Ltd',
      facilityType: 'Direct Geological Storage & Distribution Hub',
      location: 'Tees Valley Industrial Cluster, UK',
      matchScore: 91.7,
      isBestMatch: false,
      isVerified: true,
      tags: ['High Volume Buffer', 'Marine Barge Option'],
      co2Grade: 'Sequestered / Industrial Grade 99.8%',
      volume: '22,000 t/mo',
      pricePerTon: '$41.50/t',
      co2Source: 'Point-Source Capture',
      transportMode: 'Barge',
      purity: '99.82% (Moisture <5 ppm)',
      deliveryTimeline: '48h scheduled marine barge',
      certification: 'BSI PAS 2060 Verified',
      routeSteps: [
        { iconType: 'capture', label: 'Cluster Flue Scrubber' },
        { iconType: 'cryo', label: 'Deep Chilling Plant' },
        { iconType: 'terminal', label: 'Deepwater Terminal' }
      ]
    }
  ],
  supplier: [
    {
      id: 'rec-sup-1',
      companyName: 'Heidelberg Green Aggregates AG',
      facilityType: 'Mineral Carbonation & Pre-Cast Curing Plant',
      location: 'Duisburg Inland Port, DE',
      matchScore: 97.9,
      isBestMatch: true,
      isVerified: true,
      tags: ['Long-Term Offtake (3-Yr)', 'Escrow Backed'],
      co2Grade: 'Mineralization Grade 98.5%+',
      volume: '12,000 t/mo needed',
      pricePerTon: '$42.50/t bid',
      co2Source: 'Biogenic',
      transportMode: 'Barge',
      purity: 'Min 98.5% acceptable',
      deliveryTimeline: 'Starting next billing cycle',
      certification: 'EU Innovation Fund Grantee',
      routeSteps: [
        { iconType: 'capture', label: 'Supplier Outflow' },
        { iconType: 'pipeline', label: 'Rhine Barge Loading' },
        { iconType: 'terminal', label: 'Curing Chamber 3' }
      ]
    },
    {
      id: 'rec-sup-2',
      companyName: 'Bavaria BrewCarbon Consortium',
      facilityType: 'Food & Beverage Carbonation Network',
      location: 'Munich Distribution Ring, DE',
      matchScore: 93.5,
      isBestMatch: false,
      isVerified: true,
      tags: ['Premium Food Grade', 'Spot Delivery'],
      co2Grade: 'Food Grade E290 Pure',
      volume: '4,500 t/mo needed',
      pricePerTon: '$46.00/t bid',
      co2Source: 'DAC',
      transportMode: 'Cryogenic Truck',
      purity: '99.99% E290 certified',
      deliveryTimeline: 'Weekly ISO cryo deliveries',
      certification: 'FSSC 22000 Ready',
      routeSteps: [
        { iconType: 'cryo', label: 'Cryo-Tanks Station' },
        { iconType: 'truck', label: 'Dedicated Cryo-Fleet' },
        { iconType: 'terminal', label: 'Beverage Bottler Hub' }
      ]
    }
  ],
  admin: [
    {
      id: 'rec-adm-1',
      companyName: 'Rhine-Ruhr CO₂ Transshipment Corridor',
      facilityType: 'Multi-Modal Transfer Hub & Buffer Depot',
      location: 'Duisburg Gateway Terminal, DE',
      matchScore: 99.1,
      isBestMatch: true,
      isVerified: true,
      tags: ['Cross-Border Node', 'Interconnected Pipeline'],
      co2Grade: 'Universal High-Purity 99.9%',
      volume: '45,000 t/mo capacity',
      pricePerTon: '$38.90/t avg',
      co2Source: 'Biogenic',
      transportMode: 'Pipeline',
      purity: 'Dual specification manifold',
      deliveryTimeline: 'Continuous 24/7 telemetry',
      certification: 'EU Critical Infrastructure Reg',
      routeSteps: [
        { iconType: 'pipeline', label: 'Western Trunkline' },
        { iconType: 'terminal', label: 'Buffer Sphere 40k t' },
        { iconType: 'rail', label: 'Intermodal Rail Yard' }
      ]
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
