import { fetchWithAuth } from './api';

export const calculateRoute = async (token: string | null, origin: string, destination: string, volume: number, purity: number): Promise<any[]> => {
  const data = await fetchWithAuth(`/logistics/calculate-route?origin=${origin}&destination=${destination}&volume=${volume}&purity=${purity}`, token);
  
  if (!data?.options) return [];
  
  // Map backend schema (estimated_cost_inr) to frontend schema (transportCostINR) to fix the NaN bug
  return data.options.map((opt: any) => ({
    ...opt,
    distanceKm: opt.distance_km,
    transportCostINR: opt.estimated_cost_inr,
    transportEmissionsTons: opt.emissions_tco2e,
    estimatedTime: `${opt.travel_time_hrs}h`,
    volume: opt.volume_tonnes,
    reliabilityScore: opt.reliability_score
  }));
};

export const fetchShipment = async (token: string | null, orderId: string): Promise<any> => {
  if (!token) return null;
  const data = await fetchWithAuth(`/logistics/shipment/${orderId}`, token);
  return data;
};
