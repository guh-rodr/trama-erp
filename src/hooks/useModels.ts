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
    onSuccess: (data: ModelItem, variables) => {
      toast.success('Modelo registrado com sucesso!');

      if (variables.isCategoryCreation) {
        // se for criação de categoria, cria tanto a categoria quando o modelo

        queryClient.setQueriesData(
          { queryKey: ['categories', 'autocomplete', { canFetchModels: true }] },
          (oldData: CategoryItem[] | undefined) => {
            if (!oldData) return oldData;

            const { category, ...model } = data;

            return [{ ...category, models: [model] }, ...oldData];
          },
        );
      } else {
        // se for apenas criação de modelo, inclui ele na categoria selecionada

        queryClient.setQueriesData(
          { queryKey: ['categories', 'autocomplete', { canFetchModels: true }] },
          (oldData: CategoryItem[] | undefined) => {
            if (!oldData) return oldData;

            return oldData.map((cat) => {
              if (cat.id === data.category.id) {
                const model = {
                  id: data.id,
                  name: data.name,
                  itemCount: data.itemCount,
                  costPrice: data.costPrice,
                  salePrice: data.salePrice,
                };

                return {
                  ...cat,
                  models: [model, ...cat.models],
                };
              }

              return cat;
            });
          },
        );
      }
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
          if (cat.id !== data.category.id) return cat;

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
