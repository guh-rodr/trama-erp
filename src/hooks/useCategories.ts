import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import {
  createCategory,
  fetchCategories,
  fetchCategoriesAutocomplete,
  FetchCategoriesParams,
  updateCategory,
} from '../services/category';
import { CategoryResponse } from '../types/category';
import { TableParams, useTableParams } from './useTableParams';

const categoryKeys = {
  all: () => ['categories'] as const,
  lists: () => [...categoryKeys.all(), 'list'] as const,
  list: (params: TableParams) => [...categoryKeys.lists(), params] as const,
};

export function useCategories() {
  const { params } = useTableParams();

  return useQuery<CategoryResponse>({
    queryKey: categoryKeys.list(params),
    queryFn: () => fetchCategories(params),
  });
}

export function useCategoriesAutocomplete(props: FetchCategoriesParams) {
  const [enabled, setEnabled] = useState(props.fetchOnMount ?? true);

  const fetchData = () => {
    setEnabled(true);
  };

  const query = useQuery<unknown[]>({
    queryKey: ['categories', 'autocomplete', { search: props.search, canFetchModels: props.canFetchModels }],
    queryFn: () => fetchCategoriesAutocomplete(props),
    enabled,
  });

  return { ...query, fetchData };
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Categoria registrada com sucesso!');

      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success('Categoria editada com sucesso!');

      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      toast.success('Categoria excluída com sucesso.');

      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}
