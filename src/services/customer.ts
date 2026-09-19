import { api } from '../lib/api';

const API_PATH = '/customers';

export async function fetchCustomerPurchases(id: string) {
  const response = await api.get(`${API_PATH}/${id}/sales`);
  return response.data;
}

export async function fetchCustomerStats(id: string) {
  const response = await api.get(`${API_PATH}/${id}/stats`);
  return response.data;
}

export async function fetchCustomersOptions(search: string) {
  const response = await api.get(`${API_PATH}/autocomplete`, { params: { search } });
  return response.data;
}
