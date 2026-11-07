import { UserIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { Button } from '../../../components/Button';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { Textarea } from '../../../components/Textarea';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { convertToDecimal } from '../../../functions/currency';
import { useCustomersOptions } from '../../../hooks/useCustomers';
import { useCreateReceivable, useUpdateReceivable } from '../../../hooks/useReceivables';
import { getTodayDate } from '../../../lib/date';
import { ReceivableForm } from '../../../types/receivables';

const currentDate = getTodayDate();

interface Props {
  defaultValues?: ReceivableForm;
  onCreate?: () => void;
}

export function ReceivableFormDrawer({ defaultValues, onCreate }: Props) {
  const { closeDialog } = useDialog();

  const isEditMode = !!defaultValues;

  const { control, register, handleSubmit } = useForm<ReceivableForm>({
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          total: convertToDecimal(defaultValues.total),
        }
      : {
          occurredAt: currentDate,
          dueAt: currentDate,
        },
  });

  const { mutate: createReceivable, isPending: isCreating } = useCreateReceivable();
  const { mutate: updateReceivable, isPending: isUpdating } = useUpdateReceivable();

  const [customer, setCustomer] = useState({ id: '', query: '' });
  const { data: customers, status, enableFetch } = useCustomersOptions({ search: customer.query });

  const handleChangeInput = (value: string) => {
    setCustomer((state) => ({ ...state, query: value }));
  };

  const mappedCustomers = customers ? customers.map((c) => ({ label: c.name, value: c.id })) : [];
  const options = [
    ...(defaultValues?.customerId && !mappedCustomers.some((c) => c.value === defaultValues.customerId)
      ? [{ label: defaultValues.customerName, value: defaultValues?.customerId }]
      : []),
    ...mappedCustomers,
  ];

  const onSubmit: SubmitHandler<ReceivableForm> = (data) => {
    const { customerName: __, ...params } = data;

    if (isEditMode) {
      updateReceivable(params, {
        onSuccess: () => closeDialog(),
      });
    } else {
      createReceivable(data, {
        onSuccess: () => {
          closeDialog();
          onCreate?.();
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
      <div className="space-y-4 overflow-y-auto flex-1">
        <div>
          <Label>Cliente</Label>
          <Controller
            name="customerId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                placeholder="Selecione um cliente..."
                value={field.value}
                status={status}
                onOpen={enableFetch}
                onChangeInput={handleChangeInput}
                onChangeOption={field.onChange}
                options={options}
                renderOption={(option) => (
                  <span>
                    <UserIcon weight="bold" className="inline mr-2" />
                    {option.label}
                  </span>
                )}
              />
            )}
          />
        </div>

        <div className="flex gap-3 *:flex-1">
          <div>
            <Label>Emissão</Label>
            <Input type="date" {...register('occurredAt', { required: true })} />
          </div>

          <div>
            <Label>Vencimento</Label>
            <Input type="date" {...register('dueAt', { required: true })} />
          </div>
        </div>

        <div>
          <Label>Valor</Label>
          <Controller
            control={control}
            name="total"
            rules={{ required: true }}
            render={({ field }) => <CurrencyInput id="value" value={field.value} onValueChange={field.onChange} />}
          />
        </div>

        <div>
          <Label>Descrição</Label>
          <Textarea rows={4} {...register('description', { required: true })} />
        </div>
      </div>

      <Button type="submit" isLoading={isCreating || isUpdating} className="w-full mt-4 text-center">
        Confirmar
      </Button>
    </form>
  );
}
