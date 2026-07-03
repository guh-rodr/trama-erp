import { HandArrowDownIcon, HandArrowUpIcon } from '@phosphor-icons/react';
import { useCallback } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { Button } from '../../../components/Button';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useCreateTransaction, useUpdateTransaction } from '../../../hooks/useTransactions';
import { getTodayDate } from '../../../lib/date';
import { TransactionFormProps, TransactionRow } from '../../../types/transaction';
import { TRANSACTION_CATEGORIES } from '../../../utils/transactionCategories';

interface Props {
  defaultValues?: TransactionRow;
  onCreate?: () => void;
}

const currentDate = getTodayDate();

export function TransactionForm({ defaultValues, onCreate }: Props) {
  const { closeDialog } = useDialog();

  const { handleSubmit, register, setValue, watch, control, formState } = useForm<TransactionFormProps>({
    defaultValues: defaultValues
      ? { ...defaultValues, category: defaultValues.category.toUpperCase() }
      : { flow: 'inflow', date: currentDate },
  });

  const flow = watch('flow');

  const { mutate: createMutate, isPending: isPendingCreate } = useCreateTransaction();
  const { mutate: updateMutate, isPending: isPendingEdit } = useUpdateTransaction();

  const onError = useCallback(() => {
    toast.error('Existem campos vazios ou inválidos.', { id: 'form-error' });
  }, []);

  const onSubmit: SubmitHandler<TransactionFormProps> = (data) => {
    if (!defaultValues) {
      createMutate(data, {
        onSuccess: () => {
          onCreate?.();
          closeDialog();
        },
      });
    } else {
      updateMutate(
        { ...data, id: defaultValues.id },
        {
          onSuccess: () => {
            closeDialog();
          },
        },
      );
    }
  };

  const handleToggleFlow = (flow: TransactionFormProps['flow']) => {
    setValue('flow', flow, { shouldDirty: true });
    setValue('category', '');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
      <div>
        <Label>Tipo</Label>
        <div className="divide-x border border-neutral-300 divide-neutral-300 text-neutral-500 text-sm rounded-lg overflow-hidden flex">
          <button
            type="button"
            onClick={() => handleToggleFlow('inflow')}
            className={`flex items-center text-center justify-center gap-2 w-full m-0 py-2.5 ${flow === 'inflow' ? 'bg-emerald-400/10 text-emerald-500' : 'hover:bg-emerald-400/10 hover:text-emerald-500'} transition-colors`}
          >
            <HandArrowDownIcon weight="bold" />
            Entrada
          </button>

          <button
            type="button"
            onClick={() => handleToggleFlow('outflow')}
            className={`flex items-center text-center justify-center gap-2 w-full m-0 py-2.5 ${flow === 'outflow' ? 'bg-orange-400/10 text-orange-500' : 'hover:bg-orange-400/10 hover:text-orange-500'} transition-colors`}
          >
            <HandArrowUpIcon weight="bold" />
            Saída
          </button>
        </div>
      </div>

      <div className="relative">
        <Label>Categoria</Label>
        <Controller
          control={control}
          name="category"
          rules={{ required: true }}
          render={({ field }) => (
            <Autocomplete
              readOnly
              key={flow}
              value={field.value}
              onChangeOption={field.onChange}
              options={TRANSACTION_CATEGORIES[flow]}
            />
          )}
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Input type="text" id="description" {...register('description', { required: true })} />
      </div>

      <div>
        <Label htmlFor="date">Data</Label>
        <Input type="date" id="date" {...register('date')} />
      </div>

      <div>
        <Label htmlFor="value">Valor</Label>
        <Controller
          control={control}
          name="value"
          rules={{ required: true }}
          render={({ field }) => <CurrencyInput id="value" value={field.value} onValueChange={field.onChange} />}
        />
      </div>

      <div className="flex gap-4 justify-between [&>button]:h-full">
        <Button type="button" variant="outline" className="w-full mt-4 text-center" onClick={() => closeDialog()}>
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={!formState.isDirty}
          isLoading={isPendingCreate || isPendingEdit}
          className="w-full mt-4 text-center"
        >
          {defaultValues ? 'Salvar alterações' : 'Adicionar transação'}
        </Button>
      </div>
    </form>
  );
}
