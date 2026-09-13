import { fetchWithAuth } from './api';

export interface DashboardAction {
  type: string;
  payload: any;
}

export interface ChatResponse {
  reply: string;
  intent: string;
  dashboard_action?: DashboardAction | null;
  requires_confirmation: boolean;
}

export const chatWithAi = async (message: string, token: string): Promise<ChatResponse> => {
  return fetchWithAuth('/ai/chat', token, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
};
