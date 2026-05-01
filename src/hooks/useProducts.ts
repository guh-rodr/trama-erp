import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createProduct, deleteProduct, fetchProductVariants, updateProduct } from '../services/product';
import { CategoryItem } from '../types/category';
import { ProductVariant } from '../types/product';
import { useTableParams } from './useTableParams';

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

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: ({ data }) => {
      toast.success('Produto excluído com sucesso!');

      queryClient.setQueryData(['categories'], (previous: CategoryItem[]) => {
        return previous.map((cat) => {
          if (cat.id === data.categoryId) {
            return {
              ...cat,
              products: cat.products!.filter((m) => m.id !== data.id),
            };
          } else {
            return cat;
          }
        });
      });
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
