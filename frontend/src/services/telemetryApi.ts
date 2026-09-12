import { fetchWithAuth } from './api';

export const getActiveAlerts = async (token: string | null): Promise<any[]> => {
  return fetchWithAuth('/telemetry/alerts', token);
};

export const getAlertHistory = async (token: string | null): Promise<any[]> => {
  return fetchWithAuth('/telemetry/alerts/history', token);
};

export const getAlertSummary = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/telemetry/alerts/summary', token);
};

export const acknowledgeAlert = async (token: string | null, alertId: string): Promise<any> => {
  return fetchWithAuth(`/telemetry/alerts/${alertId}/acknowledge`, token, { method: 'POST' });
};

export const resolveAlert = async (token: string | null, alertId: string, resolutionNote: string): Promise<any> => {
  return fetchWithAuth(`/telemetry/alerts/${alertId}/resolve`, token, { 
    method: 'POST',
    body: JSON.stringify({ resolution_note: resolutionNote })
  });
};

export const getFacilitiesMonitoring = async (token: string | null): Promise<any[]> => {
  return fetchWithAuth('/telemetry/facilities/monitoring', token);
};

export const getShipmentsMonitoring = async (token: string | null): Promise<any[]> => {
  return fetchWithAuth('/telemetry/shipments/monitoring', token);
};
