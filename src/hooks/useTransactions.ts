import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  bulkDeleteTransactions,
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from '../services/transaction';
import { TransactionResponse } from '../types/transaction';
import { TableParams, useTableParams } from './useTableParams';

const transactionKeys = {
  all: () => ['transactions'] as const,
  lists: () => [...transactionKeys.all(), 'list'] as const,
  list: (params: TableParams) => [...transactionKeys.lists(), params] as const,
};

export function useTransactions() {
  const { params } = useTableParams();

  return useQuery<TransactionResponse>({
    queryKey: transactionKeys.list(params),
    queryFn: () => fetchTransactions(params),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success('Transação registrada com sucesso!');

      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTransaction,
    onSuccess: () => {
      toast.success('Transação editada com sucesso!');

      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      toast.success('Transação removida com sucesso!');

      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

export function useBulkDeleteTransactions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteTransactions,
    onSuccess: () => {
      toast.success('Transações removidas com sucesso!');

      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}
