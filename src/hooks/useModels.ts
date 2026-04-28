import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createModel, deleteModel, editModel, fetchModelVariants } from '../services/model';
import { CategoryItem } from '../types/category';
import { ModelItem, ModelVariant } from '../types/model';

export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createModel,
    onSuccess: (data: ModelItem) => {
      toast.success('Modelo registrado com sucesso!');

      queryClient.setQueryData(['categories'], (oldData: CategoryItem[] | undefined) => {
        if (!oldData) return oldData;

        return oldData.map((cat) => {
          if (cat.id === data.categoryId) {
            if (data.isVariable) {
              const model = {
                ...data,
                variants: data.variants,
              };

              return {
                ...cat,
                models: [model, ...cat.models],
              };
            } else {
              const model = {
                ...data,
                costPrice: data.costPrice,
                salePrice: data.salePrice,
              };

              return {
                ...cat,
                models: [model, ...cat.models],
              };
            }
          }

          return cat;
        });
      });
    },
  });
}

export function useEditModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editModel,
    onSuccess: (data: ModelItem) => {
      toast.success('Modelo editado com sucesso!');

      queryClient.setQueryData(['categories'], (previous?: CategoryItem[]) => {
        if (!previous) return previous;

        return previous.map((cat) => {
          if (cat.id !== data.categoryId) return cat;

          const models = cat.models.map((model) => (model.id === data.id ? data : model));

          return {
            ...cat,
            models,
          };
        });
      });
    },
  });
}

export function useDeleteModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteModel,
    onSuccess: ({ data }) => {
      toast.success('Modelo excluído com sucesso!');

      queryClient.setQueryData(['categories'], (previous: CategoryItem[]) => {
        return previous.map((cat) => {
          if (cat.id === data.categoryId) {
            return {
              ...cat,
              models: cat.models!.filter((m) => m.id !== data.id),
            };
          } else {
            return cat;
          }
        });
      });
    },
  });
}

export function useFetchModelVariants({ id }: { id: string }) {
  return useQuery<Partial<ModelVariant>[]>({
    queryKey: ['models', id, 'variants'],
    queryFn: () => fetchModelVariants(id),
    enabled: !!id,
  });
}
