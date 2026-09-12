import { fetchWithAuth } from './api';

export const getOrders = async (token: string | null, params?: URLSearchParams): Promise<any> => {
  const query = params ? `?${params.toString()}` : '';
  return fetchWithAuth(`/orders${query}`, token);
};

export const getOrderById = async (token: string | null, orderId: string): Promise<any> => {
  return fetchWithAuth(`/orders/${orderId}`, token);
};

export const createOrder = async (token: string | null, data: any): Promise<any> => {
  return fetchWithAuth('/orders', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateOrderStatus = async (token: string | null, orderId: string, status: string): Promise<any> => {
  return fetchWithAuth(`/orders/${orderId}/status`, token, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const cancelOrder = async (token: string | null, orderId: string): Promise<any> => {
  return fetchWithAuth(`/orders/${orderId}`, token, {
    method: 'DELETE',
  });
};
