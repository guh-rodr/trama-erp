import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  createSale,
  createSaleInstallment,
  deleteSaleInstallment,
  deleteSales,
  fetchSaleInstallments,
  fetchSaleItems,
  fetchSaleOverview,
  fetchSales,
} from '../services/sale';
import { SaleInstallment, SaleInstallmentForm, SaleItem, SaleOverview, SaleResponse, SaleRow } from '../types/sale';
import { TableParams, useTableParams } from './useTableParams';

const saleKeys = {
  all: () => ['sales'] as const,
  lists: () => [...saleKeys.all(), 'list'] as const,
  list: (params: TableParams) => [...saleKeys.lists(), params] as const,
  details: () => [...saleKeys.all(), 'details'] as const,
  detail: (id: string) => [...saleKeys.details(), id] as const,
  overview: (id: string) => [...saleKeys.detail(id), 'overview'] as const,
  items: (id: string) => [...saleKeys.detail(id), 'items'] as const,
  installments: (id: string) => [...saleKeys.detail(id), 'installments'] as const,
};

export function useSales() {
  const { params } = useTableParams();

  return useQuery<SaleResponse>({
    queryKey: saleKeys.list(params),
    queryFn: () => fetchSales(params),
  });
}

export function useSaleOverview(id: string) {
  const query = useQuery<SaleOverview>({
    queryKey: saleKeys.overview(id),
    queryFn: () => fetchSaleOverview(id),
  });

  return query;
}

export function useSaleItems(id: string) {
  const query = useQuery<SaleItem[]>({
    queryKey: saleKeys.items(id),
    queryFn: () => fetchSaleItems(id),
  });

  return query;
}

export function useSaleInstallments(id: string) {
  const query = useQuery<SaleInstallment[]>({
    queryKey: saleKeys.installments(id),
    queryFn: () => fetchSaleInstallments(id),
  });

  return query;
}

export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      toast.success('Venda registrada com sucesso!');

      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
    },
  });
}

export function useDeleteSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSales,
    onSuccess: () => {
      toast.success('Venda removida com sucesso!');

      queryClient.invalidateQueries({ queryKey: saleKeys.lists() });
    },
  });
}

export function useCreateSaleInstallment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ saleId, data }: { saleId: SaleRow['id']; data: SaleInstallmentForm }) =>
      createSaleInstallment(saleId, data),
    onSuccess: (_, variables) => {
      toast.success('Parcela registrada com sucesso!');

      queryClient.invalidateQueries({ queryKey: saleKeys.detail(variables.saleId) });
    },
  });
}

interface SaleInstallmentDeleteMutation {
  saleId: SaleRow['id'];
  installmentId: SaleInstallment['id'];
}

export function useDeleteSaleInstallment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ installmentId }: SaleInstallmentDeleteMutation) => deleteSaleInstallment(installmentId),
    onSuccess: async (_, variables) => {
      toast.success('Parcela excluída com sucesso!');

      queryClient.invalidateQueries({ queryKey: saleKeys.detail(variables.saleId) });
    },
  });
}
