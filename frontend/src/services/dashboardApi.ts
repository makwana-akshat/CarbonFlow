import { fetchWithAuth } from './api';

export interface DashboardSummary {
  kpis: any[];
  market_prices: any[];
}

export const getDashboardSummary = async (token: string | null): Promise<DashboardSummary> => {
  return fetchWithAuth('/dashboard/summary', token);
};

export const getActiveOrders = async (token: string | null): Promise<any[]> => {
  return fetchWithAuth('/orders/active', token);
};
