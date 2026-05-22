import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { FilterForm } from '../components/Filter/Filter';
import {
  createCustomer,
  deleteCustomers,
  deleteManyCustomers,
  editCustomer,
  fetchCustomerOverview,
  fetchCustomerSales,
  fetchCustomersAutocomplete,
  fetchCustomerStats,
  fetchTableCustomers,
} from '../services/customer';
import {
  CustomerAutocomplete,
  CustomerOverview,
  CustomerResponse,
  CustomerSaleItem,
  CustomerStatsResponse,
} from '../types/customer';
import { useTableParams } from './useTableParams';

export function useFetchTableCustomers(filter: FilterForm) {
  const { params } = useTableParams();

  return useQuery<CustomerResponse>({
    queryKey: ['customers/list', { ...params, filter }],
    queryFn: () => fetchTableCustomers(params, filter),
  });
}

export function useCustomersAutocomplete(props: { search?: string }) {
  const [enabled, setEnabled] = useState(false);

  const enableFetch = () => {
    setEnabled(true);
  };

  const query = useQuery<CustomerAutocomplete[]>({
    queryKey: ['customers/autocomplete', props],
    queryFn: () => fetchCustomersAutocomplete(props.search ?? ''),
    enabled,
  });

  return { ...query, enableFetch };
}

// --------------

export function useFetchCustomerOverview({ id }: { id: string }) {
  return useQuery<CustomerOverview>({
    queryKey: ['customers', id, 'overview'],
    queryFn: () => fetchCustomerOverview(id),
  });
}

export function useFetchCustomerSales({ id }: { id: string }) {
  return useQuery<CustomerSaleItem[]>({
    queryKey: ['customers', id, 'sales'],
    queryFn: () => fetchCustomerSales(id),
  });
}

export function useFetchCustomerStats({ id }: { id: string }) {
  return useQuery<CustomerStatsResponse>({
    queryKey: ['customers', id, 'stats'],
    queryFn: () => fetchCustomerStats(id),
  });
}

// --------------

export function useCreateCustomer({ queryType }: { queryType: 'list' | 'autocomplete' }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomer,
    onSuccess: (data) => {
      toast.success('Cliente registrado com sucesso!');

      if (queryType === 'list') {
        queryClient.invalidateQueries({ queryKey: ['customers/list'] });
      }

      if (queryType === 'autocomplete') {
        queryClient.setQueriesData(
          { queryKey: ['customers/autocomplete'] },
          (current: CustomerAutocomplete[] | undefined) => {
            const list = current || [];
            return [data as CustomerAutocomplete, ...list].slice(0, 5);
          },
        );
      }
    },
  });
}

export function useEditCustomer() {
  const queryClient = useQueryClient();

  const {
    params: { page },
  } = useTableParams();

  return useMutation({
    mutationFn: editCustomer,
    onSuccess: (data) => {
      toast.success('Cliente editado com sucesso!');

      queryClient.setQueriesData({ queryKey: ['customers/list', { page }] }, (oldData: CustomerResponse) => {
        return {
          rows: oldData.rows.map((customer) => {
            if (customer.id === data.id) {
              return data;
            }
            return customer;
          }),
        };
      });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    params: { page },
  } = useTableParams();

  return useMutation({
    mutationFn: deleteCustomers,
    onSuccess: () => {
      toast.success('Cliente removido com sucesso!');

      const queries = queryClient.getQueriesData<CustomerResponse>({
        queryKey: ['customers/list', { page }],
        type: 'active',
      });

      const isLastItemOnPage = queries.some(([, data]) => data?.rows?.length === 1);
      const canGoBackPage = page > 1 && isLastItemOnPage;

      if (canGoBackPage) {
        queryClient
          .invalidateQueries({
            queryKey: ['customers/list', { page: page - 1 }],
          })
          .then(() => {
            navigate(`?page=${page - 1}`);
          });
      } else {
        queryClient.invalidateQueries({ queryKey: ['customers/list'] });
      }
    },
  });
}

export function useDeleteManyCustomers() {
  const {
    params: { page },
  } = useTableParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: deleteManyCustomers,
    onSuccess: async () => {
      toast.success('Clientes removidos com sucesso!');

      const queries = queryClient.getQueriesData<CustomerResponse>({
        queryKey: ['customers/list', { page }],
        type: 'active',
      });

      const isLastItemOnPage = queries.some(([, data]) => data?.rows?.length === 1);
      const canGoBackPage = page > 1 && isLastItemOnPage;

      if (canGoBackPage) {
        queryClient
          .invalidateQueries({
            queryKey: ['customers/list', { page: page - 1 }],
          })
          .then(() => {
            navigate(`?page=${page - 1}`);
          });
      } else {
        queryClient.invalidateQueries({ queryKey: ['customers/list'] });
      }
    },
  });
}
