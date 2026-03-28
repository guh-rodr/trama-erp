import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useCreateCategory } from '../../../hooks/useCategories';
import { CreateCategoryForm } from '../../../types/category';

export function CategoryForm() {
  const { closeDialog } = useDialog();
  const { mutate, isPending } = useCreateCategory();

  const { handleSubmit, register } = useForm<CreateCategoryForm>();

  const onError = useCallback(() => {
    toast.error('Existem campos vazios ou inválidos.', { id: 'form-error' });
  }, []);

  const onSubmit: SubmitHandler<CreateCategoryForm> = (data) => {
    mutate(data, {
      onSuccess: () => {
        closeDialog();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="h-full flex flex-col justify-between space-y-4">
      <div>
        <Label htmlFor="name">Nome da categoria</Label>
        <Input
          id="name"
          {...register('name', {
            required: 'O nome da categoria é obrigatório.',
          })}
        />
      </div>

      <div className="flex gap-4 justify-between">
        <Button type="button" variant="outline" className="w-full mt-4 text-center" onClick={() => closeDialog()}>
          Cancelar
        </Button>

        <Button type="submit" isLoading={isPending} className="w-full mt-4 text-center">
          Adicionar categoria
        </Button>
      </div>
    </form>
  );
}
