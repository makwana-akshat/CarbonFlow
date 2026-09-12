import { fetchWithAuth } from './api';

export const getActiveAlerts = async (token: string | null): Promise<any[]> => {
  return fetchWithAuth('/telemetry/alerts', token);
};
