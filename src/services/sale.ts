import { TableParams } from '../hooks/useTableParams';
import { api } from '../lib/api';
import { SaleForm, SaleInstallment, SaleInstallmentForm } from '../types/sale';

const API_PATH = '/sales';

export async function fetchSales({ filter, ...params }: TableParams) {
  const response = await api.post(`${API_PATH}/list`, filter, { params });
  return response.data;
}

export async function fetchSaleOverview(id: string) {
  const response = await api.get(`${API_PATH}/${id}/overview`);
  return response.data;
}

export async function fetchSaleItems(id: string) {
  const response = await api.get(`${API_PATH}/${id}/items`);
  return response.data;
}

export async function fetchSaleInstallments(id: string) {
  const response = await api.get(`${API_PATH}/${id}/installments`);
  return response.data;
}

export async function createSale(data: SaleForm) {
  const response = await api.post(API_PATH, data);
  return response.data;
}

export async function deleteSales(ids: string[]) {
  if (ids.length > 1) {
    const response = await api.delete(API_PATH, {
      data: { ids },
    });
    return response.data;
  } else {
    const response = await api.delete(`${API_PATH}/${ids[0]}`);
    return response.data;
  }
}

export async function createSaleInstallment(saleId: string, data: SaleInstallmentForm) {
  const response = await api.post(`${API_PATH}/${saleId}/installments`, data);
  return response.data;
}

export async function deleteSaleInstallment(installmentId: SaleInstallment['id']) {
  const response = await api.delete(`/transactions/${installmentId}`);
  return response.data;
}
