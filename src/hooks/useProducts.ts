import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { FilterForm } from '../components/Filter/Filter';
import {
  bulkDeleteProducts,
  createProduct,
  deleteProduct,
  fetchProduct,
  fetchProductVariants,
  fetchTableProducts,
  updateProduct,
} from '../services/product';
import { ProductItem, ProductResponse, ProductVariant } from '../types/product';
import { useTableParams } from './useTableParams';

export function useFetchProduct({ id }: { id: string }) {
  return useQuery<ProductItem>({
    queryKey: ['products', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}

export function useFetchTableProducts(filter: FilterForm) {
  const { params } = useTableParams();

  return useQuery<ProductResponse>({
    queryKey: ['products/list', { ...params, filter }],
    queryFn: () => fetchTableProducts(params, filter),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success('Produto registrado com sucesso!');

      // esse recurso retorna estruturas diferentes entre listagem e criação, por isso é necessário invalidar a query
      queryClient.invalidateQueries({ queryKey: ['products/list'] });
    },
  });
}

export function useUpdateProduct() {
  const {
    params: { page },
  } = useTableParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success('Produto editado com sucesso!');

      // esse recurso retorna estruturas diferentes entre listagem e edição, por isso é necessário invalidar a query
      queryClient.invalidateQueries({ queryKey: ['products/list', { page }] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    params: { page },
  } = useTableParams();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Produto excluído com sucesso!');

      const queries = queryClient.getQueriesData<ProductResponse>({
        queryKey: ['products/list', { page }],
        type: 'active',
      });

      const isLastItemOnPage = queries.some(([, data]) => data?.rows?.length === 1);
      const canGoBackPage = page > 1 && isLastItemOnPage;

      if (canGoBackPage) {
        queryClient.invalidateQueries({ queryKey: ['products/list', { page: page - 1 }] }).then(() => {
          navigate(`?page=${page - 1}`);
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ['products/list'] });
      }
    },
  });
}

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    params: { page },
  } = useTableParams();

  return useMutation({
    mutationFn: bulkDeleteProducts,
    onSuccess: () => {
      toast.success('Produtos excluídos com sucesso!');

      const queries = queryClient.getQueriesData<ProductResponse>({
        queryKey: ['products/list', { page }],
        type: 'active',
      });

      const isLastItemOnPage = queries.some(([, data]) => data?.rows?.length === 1);
      const canGoBackPage = page > 1 && isLastItemOnPage;

      if (canGoBackPage) {
        queryClient.invalidateQueries({ queryKey: ['products/list', { page: page - 1 }] }).then(() => {
          navigate(`?page=${page - 1}`);
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ['products/list'] });
      }
    },
  });
}

export function useFetchProductVariants({ id }: { id: string }) {
  return useQuery<Partial<ProductVariant>[]>({
    queryKey: ['products', id, 'variants'],
    queryFn: () => fetchProductVariants(id),
    enabled: !!id,
  });
}
