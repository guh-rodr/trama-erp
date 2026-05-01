import { PlusIcon, UserIcon } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';
import { Controller, useFieldArray, useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Autocomplete } from '../../../../components/Autocomplete/Autocomplete';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { useDialog } from '../../../../contexts/dialog/dialog-context';
import { useCustomersAutocomplete } from '../../../../hooks/useCustomers';
import { useCreateSale } from '../../../../hooks/useSales';
import { getTodayDate } from '../../../../lib/date';
import { CustomerRow } from '../../../../types/customer';
import { SaleForm } from '../../../../types/sale';
import { CustomerFormModal } from '../../../customers/components/CustomerFormModal';
import { InstallmentToggleForm } from './InstallmentToggleForm';
import { ItemField } from './ItemField';
import { SaleSummary } from './SaleSummary';

const currentDate = getTodayDate();

interface Props {
  defaultCustomer?: Pick<CustomerRow, 'id' | 'name'>;
  onCreate?: () => void;
}

export function SaleFormDrawer({ onCreate, defaultCustomer }: Props) {
  const [customer, setCustomer] = useState({ id: '', query: '' });

  const { mutate } = useCreateSale();
  const { openDialog, closeDialog } = useDialog();

  const {
    control,
    register,
    setValue,
    getValues,
    handleSubmit,
    resetField,
    formState: { isSubmitting },
  } = useForm<SaleForm>({
    defaultValues: {
      customerId: defaultCustomer?.id,
      items: [{ productId: '' }],
      installment: { paidAt: currentDate },
    },
  });

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onError = useCallback(() => {
    toast.error('Existem campos vazios ou inválidos.', { id: 'form-error' });
  }, []);

  const onSubmit: SubmitHandler<SaleForm> = (data) => {
    const installment = typeof data.installment?.value === 'number' ? data.installment : undefined;

    mutate(
      { ...data, installment },
      {
        onSuccess: () => {
          closeDialog();
          onCreate?.();
        },
      },
    );
  };

  const { data: customers, status, enableFetch } = useCustomersAutocomplete({ search: customer.query });

  const mappedCustomers = customers
    ? customers.map((customer) => ({
        label: customer.name,
        value: customer.id,
      }))
    : [];

  const options = [
    ...(defaultCustomer && !mappedCustomers.some((c) => c.value === defaultCustomer.id)
      ? [{ label: defaultCustomer.name, value: defaultCustomer.id }]
      : []),
    ...mappedCustomers,
  ];

  const handleAddCustomer = () => {
    openDialog({
      type: 'modal',
      title: 'Adicionar novo cliente',
      content: (
        <CustomerFormModal creationQueryType="autocomplete" onCreate={(newId) => setValue('customerId', newId)} />
      ),
    });
  };

  const handleChangeInput = (value: string) => {
    setCustomer((state) => ({ ...state, query: value }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="h-full flex flex-col justify-between">
      <div className="space-y-1 overflow-y-auto h-full">
        <Controller
          name="customerId"
          control={control}
          render={({ field }) => (
            <Autocomplete
              placeholder="Cliente"
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
            >
              <Autocomplete.Action onClick={handleAddCustomer}>
                <PlusIcon weight="bold" />
                Novo cliente
              </Autocomplete.Action>
            </Autocomplete>
          )}
        />

        <Input type="date" defaultValue={currentDate} {...register('purchasedAt', { required: true })} />

        <hr className="border-neutral-300 mt-2" />

        {fields.map((field, index) => (
          <ItemField
            key={field.id}
            index={index}
            control={control}
            canRemove={fields.length !== 1}
            onToggleProduct={(newProductId) => update(index, { productId: newProductId, variantId: '' })}
            onAdd={() => append({ productId: '', variantId: '' })}
            onDuplicate={() => append(getValues(`items.${index}`))}
            onRemove={() => remove(index)}
          />
        ))}
      </div>

      <div>
        <SaleSummary control={control} />

        <InstallmentToggleForm control={control} resetField={resetField} />

        <Button type="submit" isLoading={isSubmitting} className="w-full mt-4 text-center">
          Finalizar venda
        </Button>
      </div>
    </form>
  );
}
