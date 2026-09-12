import { fetchWithAuth } from './api';

export const getImpactMetrics = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/impact/metrics', token);
};
