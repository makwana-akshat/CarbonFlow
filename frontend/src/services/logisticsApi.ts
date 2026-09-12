import { fetchWithAuth } from './api';

export const calculateRoute = async (token: string | null, origin: string, destination: string, volume: number, purity: number): Promise<any[]> => {
  const data = await fetchWithAuth(`/logistics/calculate-route?origin=${origin}&destination=${destination}&volume=${volume}&purity=${purity}`, token);
  return data?.options || [];
};
