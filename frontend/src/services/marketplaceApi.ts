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
  location?: string;
  distance_km?: number;
  source_type?: string;
  availability_window?: string;
  capture_capacity_tpa?: number;
  storage_pressure_bar?: number;
  is_verified?: boolean;
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
  title?: string;
  min_purity_required?: number;
  location?: string;
  application?: string;
  required_by_date?: string;
  delivery_method?: string;
  is_urgent?: boolean;
  offtake_frequency?: string;
  users?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    role: string;
  };
}

export const getListings = async (token: string | null, params?: URLSearchParams): Promise<any> => {
  const query = params ? `?${params.toString()}` : '';
  return fetchWithAuth(`/marketplace/listings${query}`, token);
};

export const getMyListings = async (token: string | null, params?: URLSearchParams): Promise<any> => {
  const query = params ? `?${params.toString()}` : '';
  return fetchWithAuth(`/marketplace/listings/me${query}`, token);
};

export const createListing = async (token: string | null, data: Partial<CO2Listing>): Promise<CO2Listing> => {
  return fetchWithAuth('/marketplace/listings', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateListing = async (token: string | null, id: string, data: Partial<CO2Listing>): Promise<CO2Listing> => {
  return fetchWithAuth(`/marketplace/listings/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteListing = async (token: string | null, id: string): Promise<void> => {
  await fetchWithAuth(`/marketplace/listings/${id}`, token, {
    method: 'DELETE',
  });
};

export const getAllRequirements = async (token: string | null, params?: URLSearchParams): Promise<any> => {
  const query = params ? `?${params.toString()}` : '';
  return fetchWithAuth(`/marketplace/requirements${query}`, token);
};

export const getMyRequirements = async (token: string | null): Promise<any[]> => {
  return fetchWithAuth('/marketplace/requirements/me', token);
};

export const getRequirementById = async (token: string | null, id: string): Promise<any> => {
  return fetchWithAuth(`/marketplace/requirements/${id}`, token);
};

export const createRequirement = async (token: string | null, data: any): Promise<any> => {
  return fetchWithAuth('/marketplace/requirements', token, {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateRequirement = async (token: string | null, id: string, data: any): Promise<any> => {
  return fetchWithAuth(`/marketplace/requirements/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const deleteRequirement = async (token: string | null, id: string): Promise<void> => {
  await fetchWithAuth(`/marketplace/requirements/${id}`, token, {
    method: 'DELETE',
  });
};
