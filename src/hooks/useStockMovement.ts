import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createStockMovement, fetchProductStockMovements, fetchStockMovements } from '../services/stock-movement';
import { StockMovementFetchParams, StockMovementProductFetch, StockMovementResponse } from '../types/stock-movement';
import { TableParams, useTableParams } from './useTableParams';

const stockMovementKeys = {
  all: () => ['stock-movements'] as const,
  lists: () => [...stockMovementKeys.all(), 'list'] as const,
  list: (params: TableParams) => [...stockMovementKeys.lists(), params] as const,
  byProduct: (params: StockMovementFetchParams) => [...stockMovementKeys.all(), 'product', params] as const,
};

export function useStockMovements() {
  const { params } = useTableParams();

  return useQuery<StockMovementResponse>({
    queryKey: stockMovementKeys.list(params),
    queryFn: () => fetchStockMovements(params),
  });
}

export function useProductStockMovements(params: StockMovementFetchParams) {
  return useQuery<StockMovementProductFetch>({
    queryKey: stockMovementKeys.byProduct(params),
    queryFn: () => fetchProductStockMovements(params),
    enabled: !!params.productId,
  });
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStockMovement,
    onSuccess: () => {
      toast.success('Movimentação registrada com sucesso!');

      queryClient.invalidateQueries({ queryKey: stockMovementKeys.all() });
    },
  });
}
