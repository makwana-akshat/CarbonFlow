import { fetchWithAuth } from './api';

export const getImpactOverview = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/impact/overview', token);
};

export const getImpactJourney = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/impact/journey', token);
};

export const getImpactPlatformSummary = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/impact/platform-summary', token);
};

export const getImpactMonthlyUtilization = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/impact/monthly-utilization', token);
};

export const getImpactApplications = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/impact/applications', token);
};

export const getImpactRegional = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/impact/regional', token);
};

export const getImpactContributors = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/impact/contributors', token);
};

export const getImpactRecentActivity = async (token: string | null): Promise<any> => {
  return fetchWithAuth('/impact/recent-activity', token);
};
