import { fetchWithAuth } from './api';

export const chatWithAi = async (message: string, token: string) => {
  return fetchWithAuth('/ai/chat', token, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
};
