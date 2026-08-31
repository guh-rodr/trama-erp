import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useCreateCategory, useUpdateCategory } from '../../../hooks/useCategories';
import { CategoryForm } from '../../../types/category';

interface Props {
  onCreate?: (categoryId: string) => void;
  defaultValues?: CategoryForm;
}

export function CategoryFormModal({ onCreate, defaultValues }: Props) {
  const { closeDialog } = useDialog();
  const { handleSubmit, register, formState } = useForm<CategoryForm>({
    defaultValues: defaultValues,
  });

  const { mutate: updateCategoryMutate, isPending: isPendingUpdate } = useUpdateCategory();
  const { mutate: createCategoryMutate, isPending: isPendingCreate } = useCreateCategory();

  const onError = useCallback(() => {
    toast.error('Existem campos vazios ou inválidos.', { id: 'form-error' });
  }, []);

  const onSubmit: SubmitHandler<CategoryForm> = (data) => {
    if (defaultValues) {
      return updateCategoryMutate(data, {
        onSuccess: () => closeDialog(),
      });
    } else {
      createCategoryMutate(data, {
        onSuccess: (data) => {
          onCreate?.(data.id as string);
          closeDialog();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 **:space-y-1.5">
      <div>
        <Label htmlFor="name">Nome da categoria</Label>
        <Input
          id="name"
          {...register('name', {
            required: 'O nome da categoria é obrigatório.',
          })}
        />
      </div>

      <div className="flex gap-4 justify-between [&>button]:h-full">
        <Button type="button" variant="outline" className="w-full mt-4 text-center" onClick={() => closeDialog()}>
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={!formState.isDirty}
          isLoading={isPendingCreate || isPendingUpdate}
          className="w-full mt-4 text-center"
        >
          {defaultValues ? 'Salvar alterações' : 'Adicionar categoria'}
        </Button>
      </div>
    </form>
  );
}
