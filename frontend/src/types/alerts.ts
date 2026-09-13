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
  actionType: string;
  actionLabel: string;
  acknowledged: boolean;
}

export interface FacilityMonitoringItem {
  id: string | number;
  facility: string;
  designCapacity: string | number;
  region: string;
  captureOutput: number;
  status: 'critical' | 'warning' | 'normal' | 'success' | string;
  expectedOutput: number | string;
  lastUpdate: string;
}

export interface ShipmentMonitoringItem {
  id: string | number;
  shipmentId: string;
  volume: string;
  carrier: string;
  route: string;
  mode: string;
  eta: string;
  status: 'delayed' | 'at-risk' | 'on-time' | string;
  risk: 'high' | 'medium' | 'low' | string;
}

export interface AlertHistoryItem {
  id: string | number;
  title: string;
  facilityOrRegion: string;
  resolutionNote: string;
  resolvedBy: string;
  resolvedTime: string;
}

export interface OperationalSummary {
  critical: number | string;
  warnings: number | string;
  active: number | string;
  resolvedToday: number | string;
}
