import { TableParams } from '../hooks/useTableParams';
import { api } from '../lib/api';
import { AccountPaymentForm, ReceivableForm, ReceivableReverseForm } from '../types/receivables';

const API_PATH = '/receivables';

export async function createReceivable(data: ReceivableForm) {
  const response = await api.post(`${API_PATH}`, data);
  return response.data;
}

export async function fetchReceivables({ filter, ...params }: TableParams) {
  const response = await api.post(`${API_PATH}/list`, filter, { params });
  return response.data;
}

export async function fetchCustomerReceivables(id: string) {
  const response = await api.get(`${API_PATH}?customerId=${id}`);
  return response.data;
}

export async function fetchReceivablePayments(id: string) {
  const response = await api.get(`${API_PATH}/${id}/payments`);
  return response.data;
}

export async function updateReceivable(data: Partial<ReceivableForm>) {
  const { id, ...body } = data;

  const response = await api({
    method: 'PATCH',
    url: `${API_PATH}/${id}`,
    data: body,
  });
  return response.data;
}

export async function deleteReceivable({ id }: { id: string }) {
  const response = await api.delete(`${API_PATH}/${id}`);
  return response.data;
}

export async function cancelReceivable({ id }: { id: string }) {
  const response = await api.post(`${API_PATH}/${id}/cancel`);
  return response.data;
}

export async function uncancelReceivable({ id }: { id: string }) {
  const response = await api.post(`${API_PATH}/${id}/uncancel`);
  return response.data;
}

export async function reverseReceivable({ id, ...data }: { id: string } & ReceivableReverseForm) {
  const response = await api.post(`${API_PATH}/${id}/reverse`, data);
  return response.data;
}

export async function createReceivablesPayments(
  params: { customerId: string; receivables?: string[] } & AccountPaymentForm,
) {
  const response = await api.post(`${API_PATH}/payments`, params);
  return response.data;
}
