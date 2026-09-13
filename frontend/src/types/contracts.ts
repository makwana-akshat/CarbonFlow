export type AuditContractStatus = 'Active' | 'Pending Review' | 'Completed' | 'Amended' | string;

export interface TimelineEvent {
  step: number;
  label: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  notes: string;
  status: 'completed' | 'in-progress' | 'pending' | string;
}

export interface ContractVersionInfo {
  version: string;
  isCurrent: boolean;
  summary: string;
  date?: string;
  effectiveDate?: string;
  author: string;
  changes: string[];
}

export interface AuditContractItem {
  id: string | number;
  contractId: string;
  supplier: string;
  buyer: string;
  volume: number | string;
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
  timeline: TimelineEvent[];
  versionHistory: ContractVersionInfo[];
}

export interface ComplianceSummary {
  activeContracts: number;
  pendingApproval: number;
  completed: number;
  withAmendments: number;
}
