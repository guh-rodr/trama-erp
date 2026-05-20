import { TableParams } from '../hooks/useTableParams';
import { api } from '../lib/api';
import { FilterForm } from '../types/filters';
import { StockMovementFetchParams, StockMovementValues } from '../types/stock-movement';

const API_PATH = '/stock-movements';

export async function fetchTableStockMovements(params: TableParams, filter: FilterForm) {
  const response = await api.post(`${API_PATH}/list`, filter, { params });
  return response.data;
}

export async function createStockMovement(data: StockMovementValues) {
  const response = await api.post(API_PATH, data);
  return response.data;
}

export async function fetchStockMovementsFromProduct(params: StockMovementFetchParams) {
  const response = await api.get(`${API_PATH}`, { params });
  return response.data;
}
