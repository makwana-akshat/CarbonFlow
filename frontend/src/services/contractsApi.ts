import { fetchWithAuth } from './api';

export interface ApiContract {
  id: string;
  contract_id: string;
  supplier_name: string;
  buyer_name: string;
  volume: string;
  contract_value: string;
  created_date: string;
  status: string;
  version: string;
  purity?: string;
  price_per_ton?: string;
  delivery_date?: string;
  transportation_terms?: string;
  payment_terms?: string;
  audit_hash?: string;
  iso_standard?: string;
  timeline: Array<{
    step: number;
    label: string;
    timestamp_str?: string;
    actor?: string;
    role?: string;
    action?: string;
    notes?: string;
    status: string;
  }>;
  version_history: Array<{
    version: string;
    is_current: boolean;
    summary?: string;
    effective_date?: string;
    author?: string;
    changes?: string[];
  }>;
}

export interface ApiComplianceSummary {
  active_contracts: number;
  pending_approval: number;
  completed: number;
  with_amendments: number;
}

export const getContracts = async (token: string | null): Promise<ApiContract[]> => {
  return fetchWithAuth(`/contracts`, token);
};

export const getComplianceSummary = async (token: string | null): Promise<ApiComplianceSummary> => {
  return fetchWithAuth(`/contracts/compliance-summary`, token);
};
