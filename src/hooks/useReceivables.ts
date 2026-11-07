import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  cancelReceivable,
  createReceivable,
  createReceivablesPayments,
  deleteReceivable,
  fetchCustomerReceivables,
  fetchReceivablePayments,
  fetchReceivables,
  reverseReceivable,
  uncancelReceivable,
  updateReceivable,
} from '../services/receivable';
import { CustomerReceivable, ReceivablePayment, ReceivableResponse } from '../types/receivables';
import { TableParams, useTableParams } from './useTableParams';

const receivableKeys = {
  all: () => ['receivables'] as const,
  lists: () => [...receivableKeys.all(), 'list'] as const,
  list: (params: TableParams) => [...receivableKeys.lists(), params] as const,
  byCustomer: (id: string) => [...receivableKeys.lists(), { id }],
  payments: (id: string) => [...receivableKeys.lists(), 'payments', { id }],
};

export function useCreateReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReceivable,
    onSuccess: () => {
      toast.success('Conta a receber criada com sucesso!');

      queryClient.invalidateQueries({ queryKey: receivableKeys.lists() });
    },
  });
}

export function useReceivables() {
  const { params } = useTableParams();

  return useQuery<ReceivableResponse>({
    queryKey: receivableKeys.list(params),
    queryFn: () => fetchReceivables(params),
  });
}

export function useCustomerReceivables({ id }: { id: string }) {
  return useQuery<CustomerReceivable[]>({
    queryKey: receivableKeys.byCustomer(id),
    queryFn: () => fetchCustomerReceivables(id),
    enabled: !!id,
  });
}

export function useReceivablePayments({ id }: { id: string }) {
  return useQuery<ReceivablePayment[]>({
    queryKey: receivableKeys.payments(id),
    queryFn: () => fetchReceivablePayments(id),
    enabled: !!id,
  });
}

export function useUpdateReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReceivable,
    onSuccess: () => {
      toast.success('Conta editada com sucesso!');

      queryClient.invalidateQueries({ queryKey: receivableKeys.lists() });
    },
  });
}

export function useDeleteReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReceivable,
    onSuccess: () => {
      toast.success('Conta excluída com sucesso!');

      queryClient.invalidateQueries({ queryKey: receivableKeys.lists() });
    },
  });
}

export function useCancelReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelReceivable,
    onSuccess: () => {
      toast.success('Conta cancelada com sucesso!');

      queryClient.invalidateQueries({ queryKey: receivableKeys.lists() });
    },
  });
}

export function useUncancelReceivable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uncancelReceivable,
    onSuccess: () => {
      toast.success('Conta revertida com sucesso!');

      queryClient.invalidateQueries({ queryKey: receivableKeys.lists() });
    },
  });
}

export function useReceivableReverse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reverseReceivable,
    onSuccess: () => {
      // toast.success('Pagamento(s) registrado(s) com sucesso!');

      queryClient.invalidateQueries({ queryKey: receivableKeys.lists() });
    },
  });
}

export function useCreateReceivablesPayments() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReceivablesPayments,
    onSuccess: () => {
      toast.success('Pagamento(s) registrado(s) com sucesso!');

      queryClient.invalidateQueries({ queryKey: receivableKeys.lists() });
    },
  });
}
