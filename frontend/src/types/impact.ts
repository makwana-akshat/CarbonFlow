// Centralized Mock Data and Domain Contracts for Carbon Impact Reporting

export interface ImpactOverviewMetric {
  id: string;
  label: string;
  tonnes: number;
  formattedTonnes: string;
  unit: string;
  trendText: string;
  trendPositive: boolean;
  subtext: string;
}

export interface JourneyStageDetail {
  activeTransactions: number;
  avgPurity: string;
  avgDistanceKm: number;
  completed: number;
  pending: number;
  activeFacilities: number;
  description: string;
  custodyCompliance: string;
}

export interface JourneyStage {
  id: 'captured' | 'listed' | 'matched' | 'transported' | 'utilized';
  order: number;
  name: string;
  tonnes: number;
  formattedTonnes: string;
  conversionPercent?: number; // % converted from previous stage
  headlineStats: string;
  tagline: string;
  details: JourneyStageDetail;
}

export interface MonthlyUtilizationData {
  month: string;
  periodLabel: string;
  tonnes: number;
  displayValue: string;
  targetTonnes: number;
}

export interface ApplicationShare {
  id: string;
  application: string;
  tonnes: number;
  formattedTonnes: string;
  percentage: number;
  primaryBuyers: string;
  colorVar: string;
}

export interface RegionalImpactItem {
  id: string;
  name: string;
  state: string;
  tonnesUtilized: number;
  formattedTonnes: string;
  activeFacilities: number;
  completedTransactions: number;
  primaryApplication: string;
  transportNetwork: string;
  coordinates: { lat: number; lng: number };
}

export interface ContributorItem {
  id: string;
  name: string;
  roleType: 'Industrial Emitter' | 'Capture Hub' | 'Offtake Consumer' | 'Refinery Synthetics';
  utilizedTonnes: number;
  formattedTonnes: string;
  transactionsCount: number;
  location: string;
  activeSince: string;
}

export interface RecentActivityItem {
  id: string;
  source: string;
  destination: string;
  volumeTonnes: number;
  formattedVolume: string;
  region: string;
  mode: 'Supercritical Pipeline' | 'ISO Rail Tanker' | 'Cryogenic Road Haul' | 'Marine Coastal';
  status: 'Completed' | 'Continuous Flow';
  completedTime: string;
}

export interface PlatformSummaryStats {
  totalUtilizedTonnes: number;
  formattedUtilizedTonnes: string;
  utilizationRatePercent: number; // Utilized / Captured
  completedTransactions: number;
  activeFacilities: number;
  connectedRegions: number;
  verifiedClearingVolumeTonnes: number;
}

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// BASE PLATFORM CONSTANTS (Single Source of Truth)
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export const BASE_OVERVIEW_METRICS: ImpactOverviewMetric[] = [
  {
    id: 'captured',
    label: 'COΓéé Captured',
    tonnes: 52400,
    formattedTonnes: '52,400',
    unit: 'tonnes',
    trendText: '+14.2%',
    trendPositive: true,
    subtext: 'vs previous 12M cycle',
  },
  {
    id: 'listed',
    label: 'COΓéé Listed',
    tonnes: 47800,
    formattedTonnes: '47,800',
    unit: 'tonnes',
    trendText: '91.2%',
    trendPositive: true,
    subtext: 'capture-to-marketplace yield',
  },
  {
    id: 'matched',
    label: 'COΓéé Matched',
    tonnes: 38200,
    formattedTonnes: '38,200',
    unit: 'tonnes',
    trendText: '184 contracts',
    trendPositive: true,
    subtext: 'cleared & legally bound',
  },
  {
    id: 'utilized',
    label: 'COΓéé Utilized',
    tonnes: 34800,
    formattedTonnes: '34,800',
    unit: 'tonnes',
    trendText: '+12.4%',
    trendPositive: true,
    subtext: 'sequestered / transformed',
  },
];

export const BASE_JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'captured',
    order: 1,
    name: 'Captured',
    tonnes: 52400,
    formattedTonnes: '52,400 t',
    headlineStats: '127 Emitter Hubs',
    tagline: 'Point-source, DAC & Biogenic inputs logged via mass-meters',
    details: {
      activeTransactions: 218,
      avgPurity: '97.2%',
      avgDistanceKm: 0,
      completed: 218,
      pending: 14,
      activeFacilities: 127,
      description: 'Physical COΓéé volumes measured at industrial boundary meters across cement, chemical synthesis, and direct air capture facilities prior to market listing.',
      custodyCompliance: 'ISO 27913 Annex A (Metered Injection)',
    },
  },
  {
    id: 'listed',
    order: 2,
    name: 'Listed',
    tonnes: 47800,
    formattedTonnes: '47,800 t',
    conversionPercent: 91,
    headlineStats: '89 Active Offerings',
    tagline: 'Assayed, graded (Food/Tech/Pure) and cleared for spot/term trading',
    details: {
      activeTransactions: 196,
      avgPurity: '98.1%',
      avgDistanceKm: 0,
      completed: 189,
      pending: 7,
      activeFacilities: 94,
      description: 'COΓéé lots certified with chemical purity assays and published to the CarbonFlow order books for buyer discovery and automated clearing.',
      custodyCompliance: 'EIGA / CGA Industrial Gas Spec G-6.2',
    },
  },
  {
    id: 'matched',
    order: 3,
    name: 'Matched',
    tonnes: 38200,
    formattedTonnes: '38,200 t',
    conversionPercent: 80,
    headlineStats: '184 Offtake Contracts',
    tagline: 'Head of Agreement (HOA) cleared between emitter and buyer',
    details: {
      activeTransactions: 184,
      avgPurity: '98.5%',
      avgDistanceKm: 216,
      completed: 162,
      pending: 22,
      activeFacilities: 88,
      description: 'B2B commitments executed between suppliers and verified offtakers with pricing benchmarks, corridor dispatch slots, and delivery assurances.',
      custodyCompliance: 'CarbonFlow Standard Master Offtake Agreement (SMOA)',
    },
  },
  {
    id: 'transported',
    order: 4,
    name: 'Transported',
    tonnes: 34900,
    formattedTonnes: '34,900 t',
    conversionPercent: 91,
    headlineStats: '1.2M Corridor Ton-km',
    tagline: 'Physical movement via pipeline trunk, ISO rail, and road cryogenic trailers',
    details: {
      activeTransactions: 172,
      avgPurity: '98.6%',
      avgDistanceKm: 216,
      completed: 160,
      pending: 12,
      activeFacilities: 74,
      description: 'Telemetry-verified custody transfer across continuous pipeline trunk lines, ISO cryogenic rail tank-cars, and heavy intermodal tankers.',
      custodyCompliance: 'ADR / PESO Cryogenic Hazmat Protocol Class 2.2',
    },
  },
  {
    id: 'utilized',
    order: 5,
    name: 'Utilized',
    tonnes: 34800,
    formattedTonnes: '34,800 t',
    conversionPercent: 99,
    headlineStats: '6 Industry Sectors',
    tagline: 'Permanent sequestration into materials, fuels, and chemical polymers',
    details: {
      activeTransactions: 162,
      avgPurity: '98.8%',
      avgDistanceKm: 216,
      completed: 158,
      pending: 4,
      activeFacilities: 68,
      description: 'Permanent binding into concrete masonry, chemical synthesis for SAF/e-methanol, agricultural enrichment, and industrial mineral carbonates.',
      custodyCompliance: 'GHG Protocol Scope 3 Category 10 & 11 Transfer Verification',
    },
  },
];

export const BASE_MONTHLY_TREND: MonthlyUtilizationData[] = [
  { month: 'May', periodLabel: 'May 2026', tonnes: 2400, displayValue: '2.4K t', targetTonnes: 2100 },
  { month: 'Jun', periodLabel: 'Jun 2026', tonnes: 3100, displayValue: '3.1K t', targetTonnes: 2800 },
  { month: 'Jul', periodLabel: 'Jul 2026', tonnes: 3800, displayValue: '3.8K t', targetTonnes: 3400 },
  { month: 'Aug', periodLabel: 'Aug 2026', tonnes: 4400, displayValue: '4.4K t', targetTonnes: 4000 },
  { month: 'Sep', periodLabel: 'Sep 2026', tonnes: 5100, displayValue: '5.1K t', targetTonnes: 4800 },
  { month: 'Oct', periodLabel: 'Oct 2026', tonnes: 5700, displayValue: '5.7K t', targetTonnes: 5200 },
  { month: 'Nov', periodLabel: 'Nov 2026', tonnes: 6100, displayValue: '6.1K t', targetTonnes: 5600 },
  { month: 'Dec', periodLabel: 'Dec 2026', tonnes: 6600, displayValue: '6.6K t', targetTonnes: 6000 },
  { month: 'Jan', periodLabel: 'Jan 2027', tonnes: 6900, displayValue: '6.9K t', targetTonnes: 6400 },
  { month: 'Feb', periodLabel: 'Feb 2027', tonnes: 7200, displayValue: '7.2K t', targetTonnes: 6700 },
  { month: 'Mar', periodLabel: 'Mar 2027', tonnes: 7600, displayValue: '7.6K t', targetTonnes: 7100 },
  { month: 'Apr', periodLabel: 'Apr 2027', tonnes: 8100, displayValue: '8.1K t', targetTonnes: 7500 },
];

export const BASE_APPLICATION_SHARES: ApplicationShare[] = [
  {
    id: 'concrete',
    application: 'Concrete & Building Materials',
    tonnes: 14337,
    formattedTonnes: '14,337 t',
    percentage: 41.2,
    primaryBuyers: 'GreenBuild Precast, UltraTech Curing Plants',
    colorVar: '#111418',
  },
  {
    id: 'efuels',
    application: 'E-Fuels (SAF / Methanol Synthesis)',
    tonnes: 9918,
    formattedTonnes: '9,918 t',
    percentage: 28.5,
    primaryBuyers: 'XYZ Fuels Dahej, AeroClean Marine Terminals',
    colorVar: '#F4611E',
  },
  {
    id: 'chemicals',
    application: 'Chemicals & Polymers',
    tonnes: 5707,
    formattedTonnes: '5,707 t',
    percentage: 16.4,
    primaryBuyers: 'Gujarat Alkalies & Chemicals, Reliance PolyChem',
    colorVar: '#3E444B',
  },
  {
    id: 'mineralization',
    application: 'Mineralization & Carbonates',
    tonnes: 2853,
    formattedTonnes: '2,853 t',
    percentage: 8.2,
    primaryBuyers: 'TerraCarbon Aggregate Works, Mundra Fillers',
    colorVar: '#6B7280',
  },
  {
    id: 'agri',
    application: 'Greenhouses & Algae Cultivation',
    tonnes: 1985,
    formattedTonnes: '1,985 t',
    percentage: 5.7,
    primaryBuyers: 'AgroBio Enrichment, Coastal MicroAlgae Farms',
    colorVar: '#10B981',
  },
];

export const BASE_REGIONAL_IMPACT: RegionalImpactItem[] = [
  {
    id: 'ahmedabad',
    name: 'Ahmedabad Industrial Corridor',
    state: 'Gujarat',
    tonnesUtilized: 6800,
    formattedTonnes: '6,800 t',
    activeFacilities: 18,
    completedTransactions: 42,
    primaryApplication: 'E-Fuels & Sustainable Aviation',
    transportNetwork: 'Western Pipeline Trunk + ISO Rail Yard',
    coordinates: { lat: 23.0225, lng: 72.5714 },
  },
  {
    id: 'hazira',
    name: 'Hazira Heavy Manufacturing Hub',
    state: 'Gujarat',
    tonnesUtilized: 5400,
    formattedTonnes: '5,400 t',
    activeFacilities: 14,
    completedTransactions: 36,
    primaryApplication: 'Steel DRI & Synthetic Chemicals',
    transportNetwork: 'Cryogenic Marine Barges & Coastal Spur',
    coordinates: { lat: 21.1097, lng: 72.6456 },
  },
  {
    id: 'jamnagar',
    name: 'Jamnagar Refining & Energy Complex',
    state: 'Gujarat',
    tonnesUtilized: 4900,
    formattedTonnes: '4,900 t',
    activeFacilities: 12,
    completedTransactions: 28,
    primaryApplication: 'E-Methanol & Chemical Derivatives',
    transportNetwork: 'Industrial Offgas Compression Line',
    coordinates: { lat: 22.4707, lng: 70.0577 },
  },
  {
    id: 'dahej',
    name: 'Dahej PCPIR Petrochemical Belt',
    state: 'Gujarat',
    tonnesUtilized: 4200,
    formattedTonnes: '4,200 t',
    activeFacilities: 11,
    completedTransactions: 24,
    primaryApplication: 'Chemical Synthesis & Plastics',
    transportNetwork: 'Regional Pipeline Terminal Head',
    coordinates: { lat: 21.7118, lng: 72.5855 },
  },
  {
    id: 'vadodara',
    name: 'Vadodara Manufacturing Zone',
    state: 'Gujarat',
    tonnesUtilized: 3900,
    formattedTonnes: '3,900 t',
    activeFacilities: 9,
    completedTransactions: 22,
    primaryApplication: 'Precast Concrete Carbonation',
    transportNetwork: 'ISO Rail Intermodal Terminal',
    coordinates: { lat: 22.3072, lng: 73.1812 },
  },
  {
    id: 'mundra',
    name: 'Mundra Special Economic Zone',
    state: 'Gujarat',
    tonnesUtilized: 3500,
    formattedTonnes: '3,500 t',
    activeFacilities: 8,
    completedTransactions: 19,
    primaryApplication: 'Aggregate Mineralization & Clinker Replacement',
    transportNetwork: 'Deepwater Terminal + High-Capacity Rail',
    coordinates: { lat: 22.8396, lng: 69.7258 },
  },
  {
    id: 'surat',
    name: 'Surat Textile & Allied Processing',
    state: 'Gujarat',
    tonnesUtilized: 3300,
    formattedTonnes: '3,300 t',
    activeFacilities: 7,
    completedTransactions: 18,
    primaryApplication: 'Water Treatment pH Neutralization',
    transportNetwork: 'Cryogenic Tanker Fleet',
    coordinates: { lat: 21.1702, lng: 72.8311 },
  },
  {
    id: 'mumbai',
    name: 'Mumbai Metropolitan Infra Node',
    state: 'Maharashtra',
    tonnesUtilized: 2800,
    formattedTonnes: '2,800 t',
    activeFacilities: 6,
    completedTransactions: 15,
    primaryApplication: 'Ready-Mix Concrete Carbon Curing',
    transportNetwork: 'Western Dedicated Freight Corridor',
    coordinates: { lat: 19.076, lng: 72.8777 },
  },
];

export const BASE_TOP_CONTRIBUTORS: ContributorItem[] = [
  {
    id: 'c1',
    name: 'ABC Cement Capture Node',
    roleType: 'Industrial Emitter',
    utilizedTonnes: 8400,
    formattedTonnes: '8,400 t',
    transactionsCount: 16,
    location: 'Ahmedabad, Gujarat',
    activeSince: 'Jan 2026',
  },
  {
    id: 'c2',
    name: 'Hazira Carbon Hub Terminals',
    roleType: 'Capture Hub',
    utilizedTonnes: 6900,
    formattedTonnes: '6,900 t',
    transactionsCount: 12,
    location: 'Hazira, Gujarat',
    activeSince: 'Feb 2026',
  },
  {
    id: 'c3',
    name: 'Jamnagar Direct Capture Plant',
    roleType: 'Industrial Emitter',
    utilizedTonnes: 5800,
    formattedTonnes: '5,800 t',
    transactionsCount: 9,
    location: 'Jamnagar, Gujarat',
    activeSince: 'Mar 2026',
  },
  {
    id: 'c4',
    name: 'CarbonFlow Fuels Synthetics',
    roleType: 'Offtake Consumer',
    utilizedTonnes: 4700,
    formattedTonnes: '4,700 t',
    transactionsCount: 8,
    location: 'Dahej PCPIR',
    activeSince: 'Jan 2026',
  },
  {
    id: 'c5',
    name: 'GreenBuild Precast Concrete',
    roleType: 'Offtake Consumer',
    utilizedTonnes: 3900,
    formattedTonnes: '3,900 t',
    transactionsCount: 11,
    location: 'Vadodara Industrial Area',
    activeSince: 'Apr 2026',
  },
  {
    id: 'c6',
    name: 'Reliance Supercritical Offtake',
    roleType: 'Refinery Synthetics',
    utilizedTonnes: 3400,
    formattedTonnes: '3,400 t',
    transactionsCount: 7,
    location: 'Jamnagar Coastal Zone',
    activeSince: 'Feb 2026',
  },
];

export const BASE_RECENT_ACTIVITY: RecentActivityItem[] = [
  {
    id: 'act-1',
    source: 'ABC Cement Capture',
    destination: 'XYZ Fuels Synthetic Unit',
    volumeTonnes: 2500,
    formattedVolume: '2,500 t',
    region: 'Ahmedabad ΓåÆ Dahej',
    mode: 'Supercritical Pipeline',
    status: 'Completed',
    completedTime: '2 hours ago',
  },
  {
    id: 'act-2',
    source: 'Hazira Carbon Hub',
    destination: 'GreenBuild Materials Plant',
    volumeTonnes: 1200,
    formattedVolume: '1,200 t',
    region: 'Surat Cluster',
    mode: 'ISO Rail Tanker',
    status: 'Completed',
    completedTime: 'Yesterday 18:40',
  },
  {
    id: 'act-3',
    source: 'Jamnagar Capture Node',
    destination: 'TerraCarbon Mineralization',
    volumeTonnes: 850,
    formattedVolume: '850 t',
    region: 'Jamnagar ΓåÆ Mundra',
    mode: 'Cryogenic Road Haul',
    status: 'Completed',
    completedTime: '2 days ago',
  },
  {
    id: 'act-4',
    source: 'AeroCapture Synthetics',
    destination: 'AgroBio Enriched Greenhouses',
    volumeTonnes: 640,
    formattedVolume: '640 t',
    region: 'Vadodara Corridor',
    mode: 'Cryogenic Road Haul',
    status: 'Completed',
    completedTime: '3 days ago',
  },
  {
    id: 'act-5',
    source: 'Dahej Industrial Capture',
    destination: 'Gujarat Polymers Terminal',
    volumeTonnes: 3100,
    formattedVolume: '3,100 t',
    region: 'Dahej Hub',
    mode: 'Supercritical Pipeline',
    status: 'Continuous Flow',
    completedTime: 'Continuous Live Flow',
  },
];

export const BASE_SUMMARY_STATS: PlatformSummaryStats = {
  totalUtilizedTonnes: 34800,
  formattedUtilizedTonnes: '34,800',
  utilizationRatePercent: 66.4,
  completedTransactions: 483,
  activeFacilities: 127,
  connectedRegions: 18,
  verifiedClearingVolumeTonnes: 34800,
};

// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
// DYNAMIC FILTER ENGINE: Recomputes real data slice based on time & region
// ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ

export interface FilterOptions {
  timeRange: '30d' | '3m' | '6m' | '1y' | 'all';
  regionFilter: string;
}

export function filterImpactData(options: FilterOptions) {
  const { timeRange, regionFilter } = options;

  // 1. Time Scaling Coefficient
  const timeFactor =
    timeRange === '30d'
      ? 0.14
      : timeRange === '3m'
      ? 0.32
      : timeRange === '6m'
      ? 0.58
      : timeRange === '1y'
      ? 1.0
      : 1.25;

  // 2. Region Scaling Coefficient & Filtering
  const isAllRegions = !regionFilter || regionFilter === 'all';
  const matchedRegion = !isAllRegions
    ? BASE_REGIONAL_IMPACT.find((r) => r.id === regionFilter)
    : null;

  const regionFactor = matchedRegion
    ? matchedRegion.tonnesUtilized / 34800
    : 1.0;

  const combinedFactor = timeFactor * (isAllRegions ? 1.0 : regionFactor * 2.8);

  // 3. Compute Overview Metrics
  const overviewMetrics: ImpactOverviewMetric[] = BASE_OVERVIEW_METRICS.map((m) => {
    const rawVal = Math.round(m.tonnes * combinedFactor);
    return {
      ...m,
      tonnes: rawVal,
      formattedTonnes: rawVal.toLocaleString(),
      subtext: isAllRegions
        ? m.subtext
        : `${matchedRegion?.name.split(' ')[0]} regional focus`,
    };
  });

  // 4. Compute Journey Stages
  const journeyStages: JourneyStage[] = BASE_JOURNEY_STAGES.map((s) => {
    const rawVal = Math.round(s.tonnes * combinedFactor);
    return {
      ...s,
      tonnes: rawVal,
      formattedTonnes: `${rawVal.toLocaleString()} t`,
    };
  });

  // 5. Compute Monthly Trend Slice
  const trendSliceCount =
    timeRange === '30d'
      ? 2
      : timeRange === '3m'
      ? 3
      : timeRange === '6m'
      ? 6
      : timeRange === '1y'
      ? 12
      : BASE_MONTHLY_TREND.length;

  const monthlyTrend: MonthlyUtilizationData[] = BASE_MONTHLY_TREND.slice(-trendSliceCount).map((item) => {
    const adjusted = Math.round(item.tonnes * (isAllRegions ? 1.0 : regionFactor * 2.2));
    return {
      ...item,
      tonnes: adjusted,
      displayValue: `${(adjusted / 1000).toFixed(1)}K t`,
    };
  });

  // 6. Compute Application Shares
  const applicationShares: ApplicationShare[] = BASE_APPLICATION_SHARES.map((app) => {
    const scaled = Math.round(app.tonnes * combinedFactor);
    return {
      ...app,
      tonnes: scaled,
      formattedTonnes: `${scaled.toLocaleString()} t`,
    };
  });

  // 7. Filter Regional Impact List
  const regionalData: RegionalImpactItem[] = isAllRegions
    ? BASE_REGIONAL_IMPACT
    : BASE_REGIONAL_IMPACT.filter((r) => r.id === regionFilter);

  // 8. Filter Top Contributors
  const topContributors: ContributorItem[] = BASE_TOP_CONTRIBUTORS.filter((c) => {
    if (isAllRegions) return true;
    const regName = matchedRegion?.name.toLowerCase() || '';
    const regCity = matchedRegion?.id || '';
    return (
      c.location.toLowerCase().includes(regCity) ||
      c.name.toLowerCase().includes(regCity) ||
      regName.includes(c.location.toLowerCase())
    );
  }).map((c) => ({
    ...c,
    utilizedTonnes: Math.round(c.utilizedTonnes * timeFactor),
    formattedTonnes: `${Math.round(c.utilizedTonnes * timeFactor).toLocaleString()} t`,
  }));

  // Fallback if regional contributor filter is empty
  const activeContributors = topContributors.length > 0
    ? topContributors
    : BASE_TOP_CONTRIBUTORS.slice(0, 3).map((c) => ({
        ...c,
        utilizedTonnes: Math.round(c.utilizedTonnes * timeFactor * 0.4),
        formattedTonnes: `${Math.round(c.utilizedTonnes * timeFactor * 0.4).toLocaleString()} t`,
      }));

  // 9. Filter Recent Activity
  const recentActivity: RecentActivityItem[] = BASE_RECENT_ACTIVITY.filter((act) => {
    if (isAllRegions) return true;
    const regCity = matchedRegion?.id || '';
    return (
      act.region.toLowerCase().includes(regCity) ||
      act.source.toLowerCase().includes(regCity) ||
      act.destination.toLowerCase().includes(regCity)
    );
  });

  const activeRecentActivity = recentActivity.length > 0
    ? recentActivity
    : BASE_RECENT_ACTIVITY.slice(0, 2);

  // 10. Summary Stats
  const utilizedVal = Math.round(BASE_SUMMARY_STATS.totalUtilizedTonnes * combinedFactor);
  const summaryStats: PlatformSummaryStats = {
    ...BASE_SUMMARY_STATS,
    totalUtilizedTonnes: utilizedVal,
    formattedUtilizedTonnes: utilizedVal.toLocaleString(),
    completedTransactions: Math.round(BASE_SUMMARY_STATS.completedTransactions * combinedFactor),
    activeFacilities: isAllRegions
      ? BASE_SUMMARY_STATS.activeFacilities
      : matchedRegion?.activeFacilities || 18,
    connectedRegions: isAllRegions ? BASE_SUMMARY_STATS.connectedRegions : 1,
  };

  return {
    overviewMetrics,
    journeyStages,
    monthlyTrend,
    applicationShares,
    regionalData,
    topContributors: activeContributors,
    recentActivity: activeRecentActivity,
    summaryStats,
  };
}
