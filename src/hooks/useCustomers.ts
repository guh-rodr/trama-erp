import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  bulkDeleteCustomers,
  createCustomer,
  deleteCustomers,
  fetchCustomerOverview,
  fetchCustomerPurchases,
  fetchCustomers,
  fetchCustomersOptions,
  fetchCustomerStats,
  updateCustomer,
} from '../services/customer';
import {
  CustomerAutocomplete,
  CustomerOverview,
  CustomerResponse,
  CustomerSaleItem,
  CustomerStatsResponse,
} from '../types/customer';
import { TableParams, useTableParams } from './useTableParams';

const customerKeys = {
  all: () => ['customers'] as const,
  options: (search?: string) => [...customerKeys.all(), 'options', search ?? ''] as const,
  lists: () => [...customerKeys.all(), 'list'] as const,
  list: (params: TableParams) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all(), 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  overview: (id: string) => [...customerKeys.detail(id), 'overview'] as const,
  purchases: (id: string) => [...customerKeys.detail(id), 'purchases'] as const,
  stats: (id: string) => [...customerKeys.detail(id), 'stats'] as const,
};

export function useCustomers() {
  const { params } = useTableParams();

  return useQuery<CustomerResponse>({
    queryKey: customerKeys.list(params),
    queryFn: () => fetchCustomers(params),
  });
}

export function useCustomerOverview({ id }: { id: string }) {
  return useQuery<CustomerOverview>({
    queryKey: customerKeys.overview(id),
    queryFn: () => fetchCustomerOverview(id),
  });
}

export function useCustomerPurchases({ id }: { id: string }) {
  return useQuery<CustomerSaleItem[]>({
    queryKey: customerKeys.purchases(id),
    queryFn: () => fetchCustomerPurchases(id),
  });
}

export function useCustomerStats({ id }: { id: string }) {
  return useQuery<CustomerStatsResponse>({
    queryKey: customerKeys.stats(id),
    queryFn: () => fetchCustomerStats(id),
  });
}

export function useCustomersOptions({ search }: { search?: string }) {
  const [enabled, setEnabled] = useState(false);

  const enableFetch = () => {
    setEnabled(true);
  };

  const query = useQuery<CustomerAutocomplete[]>({
    queryKey: customerKeys.options(search),
    queryFn: () => fetchCustomersOptions(search ?? ''),
    enabled,
  });

  return { ...query, enableFetch };
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      toast.success('Cliente registrado com sucesso!');

      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.options() });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: (_, variables) => {
      toast.success('Cliente editado com sucesso!');

      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.options() });
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.id!) });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomers,
    onSuccess: () => {
      toast.success('Cliente removido com sucesso!');

      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.options() });
    },
  });
}

export function useBulkDeleteCustomers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteCustomers,
    onSuccess: () => {
      toast.success('Clientes removidos com sucesso!');

      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.options() });
    },
  });
}
