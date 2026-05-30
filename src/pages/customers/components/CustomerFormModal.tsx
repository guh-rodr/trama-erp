import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { Textarea } from '../../../components/Textarea';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useCreateCustomer, useUpdateCustomer } from '../../../hooks/useCustomers';
import type { CustomerForm } from '../../../types/customer';

interface Props {
  onCreate?: (customerId: string) => void;
  defaultValues?: CustomerForm;
}

export function CustomerFormModal({ onCreate, defaultValues }: Props) {
  const { closeDialog } = useDialog();
  const { handleSubmit, register, formState } = useForm<CustomerForm>({
    defaultValues: defaultValues,
  });

  const navigate = useNavigate();

  const { mutate: updateCustomerMutate, isPending: isPendingUpdate } = useUpdateCustomer();
  const { mutate: createCustomerMutate, isPending: isPendingCreate } = useCreateCustomer();

  const onError = useCallback(() => {
    toast.error('Existem campos vazios ou inválidos.', { id: 'form-error' });
  }, []);

  const onSubmit: SubmitHandler<unknown> = (data) => {
    if (defaultValues) {
      return updateCustomerMutate(data as CustomerForm, {
        onSuccess: () => {
          closeDialog();
        },
      });
    } else {
      createCustomerMutate(data as CustomerForm, {
        onSuccess: (data) => {
          navigate('?page=1');

          if (data && onCreate) {
            onCreate?.(data.id as string);
          }
          closeDialog();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4 **:space-y-1.5">
      <div>
        <Label htmlFor="name">Nome do cliente</Label>
        <Input
          id="name"
          {...register('name', {
            required: 'O nome do cliente é obrigatório.',
          })}
        />
      </div>

      <div>
        <Label htmlFor="phone">Telefone (opcional)</Label>
        <Input id="phone" {...register('phone')} />
      </div>

      <div>
        <Label htmlFor="note">Nota (opcional)</Label>
        <Textarea id="note" {...register('note')} rows={5} />
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
          {defaultValues ? 'Salvar alterações' : 'Adicionar cliente'}
        </Button>
      </div>
    </form>
  );
}
