import { fetchWithAuth } from './api';

export const getDashboardKPIs = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/dashboard/kpis', token);
};

export const getMarketPrices = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/dashboard/market-prices', token);
};

export const getSupplyDemand = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/dashboard/supply-demand', token);
};

export const getDashboardAlerts = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/dashboard/alerts', token);
};

export const getDashboardInsight = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/dashboard/ai-insight', token);
};

export const getActiveOrders = async (token: string | null): Promise<any[]> => {
  return fetchWithAuth('/orders/active', token);
};
