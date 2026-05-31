import { TableParams } from '../hooks/useTableParams';
import { api } from '../lib/api';
import { StockMovementFetchParams, StockMovementValues } from '../types/stock-movement';

const API_PATH = '/stock-movements';

export async function fetchStockMovements({ filter, ...params }: TableParams) {
  const response = await api.post(`${API_PATH}/list`, filter, { params });
  return response.data;
}

export async function fetchProductStockMovements(params: StockMovementFetchParams) {
  const response = await api.get(`${API_PATH}`, { params });
  return response.data;
}

export async function createStockMovement(data: StockMovementValues) {
  const response = await api.post(API_PATH, data);
  return response.data;
}
