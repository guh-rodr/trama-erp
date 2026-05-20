import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createStockMovement,
  fetchStockMovementsFromProduct,
  fetchTableStockMovements,
} from '../services/stock-movement';
import { FilterForm } from '../types/filters';
import { StockMovementFetchParams, StockMovementProductFetch, StockMovementResponse } from '../types/stock-movement';
import { useTableParams } from './useTableParams';

export function useCreateStockMovement() {
  return useMutation({
    mutationFn: createStockMovement,
    onSuccess: () => {
      toast.success('Movimentação registrada com sucesso!');
    },
  });
}

export function useFetchStockMovementsFromProduct(params: StockMovementFetchParams) {
  return useQuery<StockMovementProductFetch>({
    queryKey: ['stock-movements', params],
    queryFn: () => fetchStockMovementsFromProduct(params),
  });
}

export function useFetchTableStockMovements(filter: FilterForm) {
  const { params } = useTableParams();

  return useQuery<StockMovementResponse>({
    queryKey: ['stock-movements/list', { ...params, filter }],
    queryFn: () => fetchTableStockMovements(params, filter),
  });
}
