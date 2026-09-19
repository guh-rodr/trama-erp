import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchCustomerPurchases, fetchCustomersOptions, fetchCustomerStats } from '../services/customer';
import { CustomerOption, CustomerSaleItem, CustomerStatsResponse } from '../types/customer';

const customerKeys = {
  all: () => ['customers'] as const,
  options: (search?: string) => [...customerKeys.all(), 'options', search ?? ''] as const,
  details: () => [...customerKeys.all(), 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  purchases: (id: string) => [...customerKeys.detail(id), 'purchases'] as const,
  stats: (id: string) => [...customerKeys.detail(id), 'stats'] as const,
};

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

  const query = useQuery<CustomerOption[]>({
    queryKey: customerKeys.options(search),
    queryFn: () => fetchCustomersOptions(search ?? ''),
    enabled,
  });

  return { ...query, enableFetch };
}
