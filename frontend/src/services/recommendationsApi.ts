import { fetchWithAuth } from './api';

export const getRecommendations = async (token: string | null, role: string): Promise<any[]> => {
  return fetchWithAuth(`/recommendations?role=${role}`, token);
};
