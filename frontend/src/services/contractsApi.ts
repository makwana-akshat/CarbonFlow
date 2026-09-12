import { fetchWithAuth } from './api';

export const getContracts = async (token: string | null): Promise<any[]> => {
  return fetchWithAuth(`/contracts`, token);
};

export const getComplianceSummary = async (token: string | null): Promise<any> => {
  return fetchWithAuth(`/contracts/compliance-summary`, token);
};
