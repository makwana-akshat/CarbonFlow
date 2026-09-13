export type AuditContractStatus = 'Active' | 'Pending Review' | 'Completed' | 'Cancelled' | 'Expired' | 'Draft' | 'Approved';

export interface AuditTimelineEvent {
  step: number;
  label: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  notes?: string;
  status: 'completed' | 'current' | 'pending' | 'in-progress' | 'upcoming';
}

export interface AuditVersionEvent {
  version: string;
  isCurrent: boolean;
  summary: string;
  date: string;
  author: string;
  changes: string[];
}

export interface AuditContractItem {
  id: string;
  contractId: string;
  supplier: string;
  buyer: string;
  volume: string;
  contractValue: string;
  createdDate: string;
  status: AuditContractStatus;
  version: string;
  purity: string;
  pricePerTon: string;
  deliveryDate: string;
  transportationTerms: string;
  paymentTerms: string;
  auditHash: string;
  isoStandard: string;
  timeline: AuditTimelineEvent[];
  versionHistory: AuditVersionEvent[];
}
