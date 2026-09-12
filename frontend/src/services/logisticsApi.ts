import { fetchWithAuth } from './api';

export const calculateRoute = async (token: string | null, origin: string, destination: string, volume: number, purity: number): Promise<any[]> => {
  const data = await fetchWithAuth(`/logistics/calculate-route?origin=${origin}&destination=${destination}&volume=${volume}&purity=${purity}`, token);
  
  if (!data?.options) return [];
  
  // Map backend schema (costInr) to frontend schema (transportCostINR) to fix the NaN bug
  return data.options.map((opt: any) => ({
    ...opt,
    transportCostINR: opt.costInr,
    transportEmissionsTons: opt.carbonEmissionsKg / 1000, // Convert kg to tons for frontend consistency
    estimatedTime: `${opt.durationHrs}h`,
  }));
};

export const fetchShipment = async (token: string | null, orderId: string): Promise<any> => {
  if (!token) return null;
  const data = await fetchWithAuth(`/logistics/shipment/${orderId}`, token);
  return data;
};
