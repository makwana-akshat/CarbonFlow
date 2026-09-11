import { fetchWithAuth } from './api';

export interface SyncUserRequest {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string | null;
}

export const syncUser = async (token: string | null, userData: SyncUserRequest) => {
  return fetchWithAuth('/users/sync', token, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const getCurrentUser = async (token: string | null) => {
  return fetchWithAuth('/users/me', token);
};
