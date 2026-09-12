// Centralized mock data and TypeScript interfaces for CarbonFlow Alerts & SCADA operational monitoring

export type AlertSeverity = 'critical' | 'warning' | 'info';
export type FacilityStatus = 'normal' | 'warning' | 'critical';
export type ShipmentStatus = 'in-transit' | 'delayed' | 'at-risk' | 'delivered';
export type ShipmentRisk = 'low' | 'medium' | 'high';

export interface OperationalSummary {
  critical: number;
  warnings: number;
  active: number;
  resolvedToday: number;
}

export interface ActiveAlertItem {
  id: string;
  severity: AlertSeverity;
  title: string;
  source: string;
  region: string;
  currentMetric: string;
  expectedMetric: string;
  variance: string;
  detectedTime: string;
  duration: string;
  description: string;
  operationalImpact: string;
  recommendedAction: string;
  actionType: 'investigate' | 'view-region' | 'view-route' | 'view-marketplace';
  actionLabel: string;
  acknowledged?: boolean;
}

export interface OperationalStatusBreakdown {
  label: string;
  count: number;
  color: string;
}

export interface OperationalStatusCategory {
  category: string;
  total: number;
  breakdown: OperationalStatusBreakdown[];
}

export interface FacilityMonitoringItem {
  id: string;
  facility: string;
  region: string;
  captureOutput: number; // percentage
  expectedOutput: number; // percentage
  status: FacilityStatus;
  lastUpdate: string;
  designCapacity: string;
}

export interface ShipmentMonitoringItem {
  id: string;
  shipmentId: string;
  route: string;
  origin: string;
  destination: string;
  mode: string;
  eta: string;
  status: ShipmentStatus;
  risk: ShipmentRisk;
  volume: string;
  carrier: string;
}

export interface AlertHistoryItem {
  id: string;
  title: string;
  facilityOrRegion: string;
  resolvedTime: string;
  resolutionNote: string;
  resolvedBy: string;
  severity: AlertSeverity;
}

export const ALERT_OPERATIONAL_SUMMARY: OperationalSummary = {
  critical: 2,
  warnings: 7,
  active: 9,
  resolvedToday: 18,
};

export const ACTIVE_ALERTS_DATA: ActiveAlertItem[] = [
  {
    id: 'ALT-101',
    severity: 'critical',
    title: 'CO₂ capture output below expected level',
    source: 'Hazira Carbon Hub',
    region: 'Hazira Industrial Zone',
    currentMetric: '82%',
    expectedMetric: '94%',
    variance: '-12%',
    detectedTime: '8 minutes ago',
    duration: '23 minutes',
    description: 'Flue-gas amine absorption loop column 2 experiencing reduced thermal regeneration heat transfer.',
    operationalImpact: "Potential reduction in today's available CO₂ supply (projected -180 tonnes against offload commitments).",
    recommendedAction: "Review capture line performance and confirm whether today's marketplace commitments may be affected.",
    actionType: 'investigate',
    actionLabel: 'Investigate',
  },
  {
    id: 'ALT-102',
    severity: 'warning',
    title: 'Supply shortage risk detected',
    region: 'Ahmedabad',
    source: 'Ahmedabad Industrial Cluster',
    currentMetric: '1,600 t',
    expectedMetric: 'Next 7 days',
    variance: '-22% buffer',
    detectedTime: '24 minutes ago',
    duration: '1.5 hours',
    description: 'Demand surge from concrete curing and mineralization facilities outstripping scheduled biogenic delivery pipeline.',
    operationalImpact: 'Buffer tanks at Sabarmati receiving terminal projected to reach critical 15% reserve threshold by Thursday.',
    recommendedAction: 'Trigger spot marketplace procurement or reroute ISO rail tankers from Dahej corridor.',
    actionType: 'view-region',
    actionLabel: 'View Region',
  },
  {
    id: 'ALT-103',
    severity: 'warning',
    title: 'Route disruption on freight corridor',
    region: 'Western Rail Corridor',
    source: 'Mundra → Ahmedabad',
    currentMetric: '2–4 hours delay',
    expectedMetric: 'On-time 18:40',
    variance: '+3.5h delay',
    detectedTime: '42 minutes ago',
    duration: '45 minutes',
    description: 'Track maintenance and cryogenic rail car shunting bottleneck near Viramgam junction.',
    operationalImpact: 'Shipment SHP-8924 carrying 320 t liquid CO₂ delayed for evening liquefaction offload.',
    recommendedAction: 'Alert offtake facility receiving team and adjust vaporization heating schedule accordingly.',
    actionType: 'view-route',
    actionLabel: 'View Route',
  },
  {
    id: 'ALT-104',
    severity: 'info',
    title: 'Price threshold triggered',
    region: 'Spot Marketplace',
    source: 'Western India Spot Index',
    currentMetric: '₹4,650/t',
    expectedMetric: '₹5,000/t target',
    variance: '-₹350/t',
    detectedTime: '1 hour ago',
    duration: '1 hour',
    description: 'Surplus food-grade CO₂ from Dahej chemical complex listed below procurement target.',
    operationalImpact: 'Favorable buying window for 1,200 tonnes beverage-grade liquefaction supply.',
    recommendedAction: 'Initiate automated clearing or notify procurement stakeholders to lock in contracted rates.',
    actionType: 'view-marketplace',
    actionLabel: 'View Marketplace',
  },
  {
    id: 'ALT-105',
    severity: 'warning',
    title: 'Pipeline pressure drop at custody transfer point',
    region: 'Jamnagar',
    source: 'Jamnagar - Vadodara Pipeline Leg B',
    currentMetric: '68.4 bar',
    expectedMetric: '74.0 bar',
    variance: '-7.5%',
    detectedTime: '1 hour 15 min ago',
    duration: '40 minutes',
    description: 'Compressor booster station 3 operating at throttled bypass mode following scheduled valve inspection.',
    operationalImpact: 'Dense-phase supercritical mass flow velocity reduced by 14 t/h to Vadodara receiver.',
    recommendedAction: 'Inspect valve seals at transfer meter skid KM-42 and restore nominal discharge pressure.',
    actionType: 'investigate',
    actionLabel: 'Investigate',
  },
  {
    id: 'ALT-106',
    severity: 'critical',
    title: 'Purity assay deviation: N₂ threshold breached',
    region: 'Mumbai',
    source: 'Mumbai Waste Recovery Unit 4',
    currentMetric: '96.2%',
    expectedMetric: '≥99.5%',
    variance: '-3.3%',
    detectedTime: '1 hour 30 min ago',
    duration: '52 minutes',
    description: 'Cryogenic distillation condenser outlet nitrogen fraction measured at 3.1% exceeding offtake specification.',
    operationalImpact: 'Offtake lot #MB-992 quarantine initiated; tanker loading halted to protect buyer catalyst bed.',
    recommendedAction: 'Engage purge cycle on secondary distillation column and re-verify online chromatograph.',
    actionType: 'investigate',
    actionLabel: 'Investigate',
  },
  {
    id: 'ALT-107',
    severity: 'info',
    title: 'Buffer storage capacity at 91%',
    region: 'Dahej',
    source: 'Dahej Supercritical Storage Sphere S-3',
    currentMetric: '4,550 t',
    expectedMetric: '5,000 t max',
    variance: '91% filled',
    detectedTime: '2 hours ago',
    duration: '2 hours',
    description: 'Liquefied storage inventory approaching high-level alarm due to delayed rail tanker repositioning.',
    operationalImpact: 'May require rate curtailment if tanker clearance is not accelerated within 6 hours.',
    recommendedAction: 'Expedite departure of train CF-RAIL-04 to Ahmedabad terminal.',
    actionType: 'view-region',
    actionLabel: 'View Region',
  },
];

export const OPERATIONAL_STATUS_CATEGORIES: OperationalStatusCategory[] = [
  {
    category: 'Facilities',
    total: 48,
    breakdown: [
      { label: 'Normal', count: 42, color: 'var(--status-success)' },
      { label: 'Warning', count: 4, color: 'var(--status-warning)' },
      { label: 'Critical', count: 2, color: 'var(--status-danger)' },
    ],
  },
  {
    category: 'Transport',
    total: 22,
    breakdown: [
      { label: 'Normal', count: 18, color: 'var(--status-success)' },
      { label: 'Delayed', count: 3, color: 'var(--status-warning)' },
      { label: 'Disrupted', count: 1, color: 'var(--status-danger)' },
    ],
  },
  {
    category: 'Supply',
    total: 39,
    breakdown: [
      { label: 'Stable', count: 31, color: 'var(--status-success)' },
      { label: 'At Risk', count: 6, color: 'var(--status-warning)' },
      { label: 'Critical', count: 2, color: 'var(--status-danger)' },
    ],
  },
  {
    category: 'Orders',
    total: 53,
    breakdown: [
      { label: 'On Track', count: 47, color: 'var(--status-success)' },
      { label: 'At Risk', count: 5, color: 'var(--status-warning)' },
      { label: 'Delayed', count: 1, color: 'var(--status-danger)' },
    ],
  },
];

export const FACILITY_MONITORING_DATA: FacilityMonitoringItem[] = [
  {
    id: 'FAC-01',
    facility: 'Hazira Carbon Hub',
    region: 'Hazira',
    captureOutput: 82,
    expectedOutput: 94,
    status: 'critical',
    lastUpdate: '8 min ago',
    designCapacity: '1,200 t/d',
  },
  {
    id: 'FAC-02',
    facility: 'Tata Steel Cleantech',
    region: 'Jamshedpur',
    captureOutput: 96,
    expectedOutput: 95,
    status: 'normal',
    lastUpdate: '2 min ago',
    designCapacity: '2,500 t/d',
  },
  {
    id: 'FAC-03',
    facility: 'Jamnagar Capture Facility',
    region: 'Jamnagar',
    captureOutput: 89,
    expectedOutput: 93,
    status: 'warning',
    lastUpdate: '4 min ago',
    designCapacity: '3,800 t/d',
  },
  {
    id: 'FAC-04',
    facility: 'Dahej Chemical Complex',
    region: 'Dahej',
    captureOutput: 95,
    expectedOutput: 95,
    status: 'normal',
    lastUpdate: '12 min ago',
    designCapacity: '1,500 t/d',
  },
  {
    id: 'FAC-05',
    facility: 'Mundra Energy Center',
    region: 'Mundra',
    captureOutput: 91,
    expectedOutput: 92,
    status: 'normal',
    lastUpdate: '15 min ago',
    designCapacity: '1,800 t/d',
  },
  {
    id: 'FAC-06',
    facility: 'Vadodara SynGas Plant',
    region: 'Vadodara',
    captureOutput: 88,
    expectedOutput: 91,
    status: 'warning',
    lastUpdate: '18 min ago',
    designCapacity: '950 t/d',
  },
  {
    id: 'FAC-07',
    facility: 'Ahmedabad Biogenic Unit',
    region: 'Ahmedabad',
    captureOutput: 98,
    expectedOutput: 96,
    status: 'normal',
    lastUpdate: '21 min ago',
    designCapacity: '650 t/d',
  },
  {
    id: 'FAC-08',
    facility: 'Mumbai Waste Recovery',
    region: 'Mumbai',
    captureOutput: 76,
    expectedOutput: 90,
    status: 'critical',
    lastUpdate: '25 min ago',
    designCapacity: '800 t/d',
  },
];

export const SHIPMENT_MONITORING_DATA: ShipmentMonitoringItem[] = [
  {
    id: 'SHP-01',
    shipmentId: 'SHP-8924',
    route: 'Mundra → Ahmedabad',
    origin: 'Mundra Port Terminal',
    destination: 'Ahmedabad Offtake Hub',
    mode: 'Rail + Truck',
    eta: '18:40',
    status: 'delayed',
    risk: 'medium',
    volume: '320 t',
    carrier: 'Adani Logistics Rail',
  },
  {
    id: 'SHP-02',
    shipmentId: 'SHP-8931',
    route: 'Hazira → Mumbai',
    origin: 'Hazira Carbon Hub',
    destination: 'Mumbai BioFuels Plant',
    mode: 'Cryo Truck',
    eta: '20:15',
    status: 'delayed',
    risk: 'medium',
    volume: '54 t',
    carrier: 'CryoExpress Logistics',
  },
  {
    id: 'SHP-03',
    shipmentId: 'SHP-8940',
    route: 'Dahej → Pune',
    origin: 'Dahej Chemical Complex',
    destination: 'Pune Tech Concrete',
    mode: 'Cryo Truck',
    eta: 'Tomorrow 06:00',
    status: 'at-risk',
    risk: 'high',
    volume: '86 t',
    carrier: 'Western Cryo Movers',
  },
  {
    id: 'SHP-04',
    shipmentId: 'SHP-8952',
    route: 'Jamnagar → Vadodara',
    origin: 'Jamnagar Capture Center',
    destination: 'Vadodara E-Fuels',
    mode: 'ISO Rail Tanker',
    eta: '22:30',
    status: 'in-transit',
    risk: 'low',
    volume: '450 t',
    carrier: 'Indian Railways Bulk Freight',
  },
  {
    id: 'SHP-05',
    shipmentId: 'SHP-8961',
    route: 'Hazira → Surat',
    origin: 'Hazira Capture Grid',
    destination: 'Surat Green Curing',
    mode: 'Pipeline Grid',
    eta: '19:15',
    status: 'in-transit',
    risk: 'low',
    volume: '180 t/h',
    carrier: 'Gujarat Carbon Pipeline Corp',
  },
  {
    id: 'SHP-06',
    shipmentId: 'SHP-8975',
    route: 'Ahmedabad → Sanand',
    origin: 'Sabarmati Hub',
    destination: 'Sanand Industrial Park',
    mode: 'Cryo Truck',
    eta: '17:50',
    status: 'in-transit',
    risk: 'low',
    volume: '48 t',
    carrier: 'CleanTransport India',
  },
];

export const ALERT_HISTORY_DATA: AlertHistoryItem[] = [
  {
    id: 'HIST-01',
    title: 'Supply shortage risk',
    facilityOrRegion: 'Ahmedabad',
    resolvedTime: 'Resolved 2h ago',
    resolutionNote: 'Auto-rebalanced via Dahej rail transfer allocation (+400 t reserve unlocked)',
    resolvedBy: 'System Auto-Balancing Agent',
    severity: 'warning',
  },
  {
    id: 'HIST-02',
    title: 'Route disruption',
    facilityOrRegion: 'Mundra → Ahmedabad',
    resolvedTime: 'Resolved 4h ago',
    resolutionNote: 'High-priority green freight clearance granted via Viramgam loop track',
    resolvedBy: 'Logistics Dispatch Desk',
    severity: 'warning',
  },
  {
    id: 'HIST-03',
    title: 'Facility warning: compressor vibration',
    facilityOrRegion: 'Jamnagar Capture Center',
    resolvedTime: 'Resolved yesterday',
    resolutionNote: 'Secondary amine recirculation pump brought online; primary unit scheduled for maintenance',
    resolvedBy: 'Site Reliability Engineering',
    severity: 'warning',
  },
  {
    id: 'HIST-04',
    title: 'Purity sensor deviation',
    facilityOrRegion: 'Dahej Terminal 1',
    resolvedTime: 'Resolved yesterday',
    resolutionNote: 'Online gas chromatograph recalibrated against certified calibration gas (ISO 14064 spec)',
    resolvedBy: 'QA Lab Tech',
    severity: 'info',
  },
  {
    id: 'HIST-05',
    title: 'Cryogenic trailer relief valve seal test',
    facilityOrRegion: 'Surat Logistics Depot',
    resolvedTime: 'Resolved 2 days ago',
    resolutionNote: 'Hydrostatic pressure test successfully passed for fleet trailers #TR-102 through #TR-108',
    resolvedBy: 'Fleet Inspector',
    severity: 'info',
  },
];
