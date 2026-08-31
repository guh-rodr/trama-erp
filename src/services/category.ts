import { TableParams } from '../hooks/useTableParams';
import { api } from '../lib/api';
import { CategoryForm } from '../types/category';

const API_PATH = '/categories';

export interface FetchCategoriesParams {
  fetchOnMount: boolean;
  canFetchModels: boolean;
  search?: string;
}

export async function fetchCategories({ filter, ...params }: TableParams) {
  const response = await api.post(`${API_PATH}/list`, filter, { params });
  return response.data;
}

export async function fetchCategoriesAutocomplete({ search, canFetchModels }: FetchCategoriesParams) {
  const response = await api.get(`${API_PATH}/autocomplete`, { params: { search, fetchModels: canFetchModels } });
  return response.data;
}

export async function createCategory(data: CategoryForm) {
  const response = await api.post(API_PATH, data);
  return response.data;
}

export async function updateCategory({ id, ...data }: CategoryForm) {
  const response = await api.patch(`${API_PATH}/${id}`, data);
  return response.data;
}

export async function deleteCategory({ id }: { id: string }) {
  const response = await api.delete(`${API_PATH}/${id}`);
  return response.data;
}
