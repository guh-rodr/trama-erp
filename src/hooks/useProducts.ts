import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FetchProductsParams,
  bulkDeleteProducts,
  createProduct,
  deleteProduct,
  fetchProduct,
  fetchProductVariants,
  fetchProducts,
  fetchProductsOptions,
  updateProduct,
} from '../services/product';
import { ProductItem, ProductOption, ProductResponse, ProductVariant } from '../types/product';
import { TableParams, useTableParams } from './useTableParams';

const productKeys = {
  all: () => ['products'] as const,
  lists: () => [...productKeys.all(), 'list'] as const,
  list: (params: TableParams) => [...productKeys.lists(), params] as const,
  options: (search?: string) => [...productKeys.all(), 'options', search ?? ''] as const,
  details: () => [...productKeys.all(), 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  variants: (id: string) => [...productKeys.detail(id), 'variants'] as const,
};

export function useProduct({ id }: { id: string }) {
  return useQuery<ProductItem>({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}

export function useProductVariants({ id }: { id: string }) {
  return useQuery<Partial<ProductVariant>[]>({
    queryKey: productKeys.variants(id),
    queryFn: () => fetchProductVariants(id),
    enabled: !!id,
  });
}

export function useProducts() {
  const { params } = useTableParams();

  return useQuery<ProductResponse>({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
  });
}

export function useProductsOptions(props: FetchProductsParams) {
  const [enabled, setEnabled] = useState(props.fetchOnMount ?? true);

  const fetchData = () => {
    setEnabled(true);
  };

  const query = useQuery<ProductOption[]>({
    queryKey: productKeys.options(),
    queryFn: () => fetchProductsOptions(props),
    enabled,
  });

  return { ...query, fetchData };
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success('Produto registrado com sucesso!');

      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success('Produto editado com sucesso!');

      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Produto excluído com sucesso!');

      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteProducts,
    onSuccess: () => {
      toast.success('Produtos excluídos com sucesso!');

      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
