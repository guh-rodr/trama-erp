import { FilterForm } from '../components/Filter/Filter';
import { TableParams } from '../hooks/useTableParams';
import { api } from '../lib/api';
import { ProductForm } from '../types/product';

const API_PATH = '/products';

interface CreateMutationProps extends ProductForm {
  isCategoryCreation?: boolean;
}

export async function fetchProduct(id: string) {
  const response = await api.get(`${API_PATH}/${id}`);
  return response.data;
}

export async function fetchTableProducts(params: TableParams, filter: FilterForm) {
  const response = await api.post(`${API_PATH}/list`, filter, { params });
  return response.data;
}

export async function createProduct({ category, ...data }: CreateMutationProps) {
  const response = await api.post(API_PATH, { categoryId: category, ...data });
  return response.data;
}

export async function fetchProductVariants(id: string) {
  const response = await api.get(`${API_PATH}/${id}/variants`);
  return response.data;
}

export async function updateProduct(data: ProductForm) {
  const { id, ...product } = data;

  const response = await api.patch(`${API_PATH}/${id}`, product);
  return response.data;
}

export async function deleteProduct(id: string) {
  const response = await api.delete(`${API_PATH}/${id}`);
  return response.data;
}

export async function bulkDeleteProducts(ids: string[]) {
  const response = await api.post(`${API_PATH}/bulk-delete`, { ids });
  return response.data;
}
