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
      distance: '182 km',
      reliability: '99.4%',
      segment: 'DAC',
      reasons: [
        'Meets your purity threshold of >99.9% with certified 99.98% cryogenic assay.',
        'Located 182 km from your facility via dedicated ISO rail direct terminal.',
        'Unit price of $39.20/t is 11% below regional spot benchmark.',
        'Segment match: DAC (Direct Air Capture) with ISO 14064-2 verified removal.',
        '99.4% historical on-time delivery across verified custody transfers.'
      ],
      breakdown: {
        purity: 99,
        price: 94,
        distance: 92,
        reliability: 99,
        segmentFit: 98
      },
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
      distance: '314 km',
      reliability: '98.1%',
      segment: 'BIOGENIC',
      reasons: [
        'Meets required volume capacity with 14,200 t/mo continuous throughput.',
        'Connected via direct continuous 40 bar regional pipeline trunkline.',
        'Competitive unit pricing at $36.80/t with index-linked quarterly escrow.',
        'Segment match: Biogenic fermentation with ISCC PLUS carbon certification.',
        '98.1% pipeline pressure uptime across continuous SCADA telemetry.'
      ],
      breakdown: {
        purity: 95,
        price: 98,
        distance: 88,
        reliability: 97,
        segmentFit: 93
      },
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
      distance: '520 km',
      reliability: '96.5%',
      segment: 'FOOD-GRADE',
      reasons: [
        'Deep-water terminal access supporting large 22,000 t/mo buffer capacity.',
        '520 km coastal intermodal corridor with 48h scheduled marine barge dispatch.',
        'Chemical purity exceeds 99.8% with moisture content strictly under 5 ppm.',
        'Dual-verified compliance under BSI PAS 2060 carbon accountability standards.',
        '96.5% custody transfer completion rate with real-time bill-of-lading notarization.'
      ],
      breakdown: {
        purity: 92,
        price: 90,
        distance: 81,
        reliability: 95,
        segmentFit: 91
      },
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
      distance: '145 km',
      reliability: '99.1%',
      segment: 'BIOGENIC',
      reasons: [
        'Guaranteed 3-year bilateral offtake agreement backed by platform escrow.',
        'Located 145 km along the Rhine inland navigation waterway.',
        'Above-market purchase bid of $42.50/t securing steady operational margins.',
        'Segment match: Industrial mineralization with verified sequestration certs.',
        '99.1% payment settlement reliability record.'
      ],
      breakdown: {
        purity: 98,
        price: 96,
        distance: 94,
        reliability: 99,
        segmentFit: 97
      },
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
      distance: '280 km',
      reliability: '98.5%',
      segment: 'FOOD-GRADE',
      reasons: [
        'Premium high-margin demand offering $46.00/t for food-grade purity.',
        'Weekly scheduled deliveries with dedicated cryogenic road tankers.',
        'FSSC 22000 food and beverage compliance protocol match.',
        'Segment match: Food Grade E290 with immediate spot liquidity.',
        '98.5% operational receiving score.'
      ],
      breakdown: {
        purity: 99,
        price: 98,
        distance: 87,
        reliability: 98,
        segmentFit: 95
      },
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
      distance: '95 km',
      reliability: '99.8%',
      segment: 'DAC',
      reasons: [
        'Primary intermodal hub connecting rail, barge, and continuous pipeline grids.',
        '45,000 t/mo buffer capacity mitigates corridor supply bottlenecks.',
        'Lowest average systemic tariff of $38.90/t across regional routes.',
        'Designated as EU critical infrastructure project with automated MRV.',
        '99.8% cross-border settlement and dispatch accuracy.'
      ],
      breakdown: {
        purity: 99,
        price: 95,
        distance: 98,
        reliability: 99,
        segmentFit: 99
      },
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
