export type AlertSeverity = 'critical' | 'warning' | 'info' | 'all';

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
  actionType: 'investigate' | 'view-route' | 'contact-facility' | 'override';
  actionLabel: string;
  acknowledged?: boolean;
}

export interface FacilityMonitoringItem {
  id: string;
  facility: string;
  region: string;
  captureOutput: number | null;
  expectedOutput: number | null;
  status: 'active' | 'warning' | 'critical' | 'maintenance';
  lastUpdate: string;
  designCapacity: string | null;
}

export interface ShipmentMonitoringItem {
  id: string;
  shipmentId: string;
  route: string | null;
  origin: string;
  destination: string;
  mode: string;
  eta: string | null;
  status: 'in-transit' | 'delayed' | 'at-risk' | 'delivered';
  risk: 'low' | 'medium' | 'high';
  volume: string | null;
  carrier: string | null;
}

export interface AlertHistoryItem {
  id: string;
  severity: AlertSeverity;
  title: string;
  timestamp: string;
  resolvedBy: string;
  resolutionNote: string;
  facilityOrRegion: string;
  resolvedTime: string;
}

export interface OperationalSummary {
  critical: number;
  warnings: number;
  active: number;
  resolvedToday: number;
}

export interface StatusBreakdown {
  label: string;
  count: number;
  color: string;
}

export interface OperationsCategory {
  category: string;
  total: number;
  breakdown: StatusBreakdown[];
}

export interface OperationsHealthIndexResponse {
  categories: OperationsCategory[];
}
