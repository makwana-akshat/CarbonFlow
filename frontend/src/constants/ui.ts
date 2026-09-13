import type { TabItem } from '../types/dashboard';

export interface CategoryChip {
  id: string;
  label: string;
}

export const SEARCH_CATEGORY_CHIPS: CategoryChip[] = [
  { id: '1', label: 'Shipment' },
  { id: '2', label: 'Cargo' },
  { id: '3', label: 'Route' },
  { id: '4', label: 'Facility' }
];

export const NAVIGATION_TABS: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'marketplace', label: 'Marketplace' },
  { id: 'maps', label: 'Maps' },
  { id: 'orders', label: 'Orders' },
  { id: 'logistics', label: 'Logistics' },
  { id: 'carbon-impact', label: 'Impact' },
  { id: 'alerts', label: 'Alerts' },
  { id: 'audit-contracts', label: 'Contracts' },
  { id: 'settings', label: 'Settings' }
];
