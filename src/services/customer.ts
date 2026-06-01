import { TableParams } from '../hooks/useTableParams';
import { api } from '../lib/api';
import { CustomerForm } from '../types/customer';

const API_PATH = '/customers';

export async function fetchCustomers({ filter, ...params }: TableParams) {
  const response = await api.post(`${API_PATH}/list`, filter, { params });
  return response.data;
}

export async function fetchCustomerOverview(id: string) {
  const response = await api.get(`${API_PATH}/${id}/overview`);
  return response.data;
}

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

export async function createCustomer(data: CustomerForm) {
  const response = await api.post(API_PATH, data);
  return response.data;
}

export async function updateCustomer(data: CustomerForm) {
  const { id, ...body } = data;

  const response = await api({
    method: 'PATCH',
    url: `${API_PATH}/${id}`,
    data: body,
  });
  return response.data;
}

export async function deleteCustomers({ id }: { id: string }) {
  const response = await api.delete(`${API_PATH}/${id}`);
  return response.data;
}

export async function bulkDeleteCustomers({ ids }: { ids: string[] }) {
  const response = await api.delete(`${API_PATH}`, {
    data: { ids },
  });
  return response.data;
}
