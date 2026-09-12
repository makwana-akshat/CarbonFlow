import { fetchWithAuth } from './api';

export interface CO2Listing {
  id: string;
  supplier_id: string;
  facility_name: string;
  co2_grade: string;
  volume_tpa: number;
  price_per_ton: number;
  purity_percentage: number;
  transport_modes: string[];
  status: string;
  created_at: string;
  users?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    role: string;
  };
}

export interface CO2Request {
  id: string;
  buyer_id: string;
  required_grade: string;
  volume_needed: number;
  target_price: number;
  status: string;
  created_at: string;
  users?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    role: string;
  };
}

export const getListings = async (token: string | null): Promise<CO2Listing[]> => {
  return fetchWithAuth('/marketplace/listings', token);
};

export const createListing = async (token: string | null, data: Partial<CO2Listing>): Promise<CO2Listing> => {
  return fetchWithAuth('/marketplace/listings', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getAllRequirements = async (token: string | null): Promise<CO2Request[]> => {
  return fetchWithAuth('/marketplace/requirements', token);
};

export const getMyRequirements = async (token: string | null): Promise<CO2Request[]> => {
  return fetchWithAuth('/marketplace/requirements/me', token);
};

export const createRequirement = async (token: string | null, data: Partial<CO2Request>): Promise<CO2Request> => {
  return fetchWithAuth('/marketplace/requirements', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
