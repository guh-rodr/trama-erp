import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../lib/api';
import { CategoryItem } from '../types/category';
import { ModelForm, ModelItem } from '../types/model';

interface CreateMutationProps extends ModelForm {
  isCategoryCreation?: boolean;
}

export function useCreateModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, ...model }: CreateMutationProps) => {
      const response = await api.post(`/categories/${category}/models`, model);
      return response.data;
    },
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
    mutationFn: async ({ category, ...model }: Required<ModelForm>) => {
      const response = await api.patch(`/categories/${category}/models/${model.id}`, model);
      return response.data;
    },
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

interface DeleteMutationProps {
  categoryId: string;
  modelId: string;
}

export function useDeleteModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ categoryId, modelId }: DeleteMutationProps) => {
      return api.delete(`/categories/${categoryId}/models/${modelId}`);
    },
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
