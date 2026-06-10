import { PlusIcon, UserIcon } from '@phosphor-icons/react';
import { useCallback, useState } from 'react';
import { Controller, FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Autocomplete } from '../../../../components/Autocomplete/Autocomplete';
import { Button } from '../../../../components/Button';
import { Input } from '../../../../components/Input';
import { Label } from '../../../../components/Label';
import { useDialog } from '../../../../contexts/dialog/dialog-context';
import { useCustomersOptions } from '../../../../hooks/useCustomers';
import { useCreateSale } from '../../../../hooks/useSales';
import { getTodayDate } from '../../../../lib/date';
import { CustomerRow } from '../../../../types/customer';
import { SaleForm } from '../../../../types/sale';
import { CustomerFormModal } from '../../../customers/components/CustomerFormModal';
import { InstallmentToggleForm } from './InstallmentToggleForm';
import { SaleItemsTable } from './SaleItemsTable';
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

  const methods = useForm<SaleForm>({
    defaultValues: {
      customerId: defaultCustomer?.id,
      items: [{ productId: '' }],
      installment: { paidAt: currentDate },
    },
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

  const { data: customers, status, enableFetch } = useCustomersOptions({ search: customer.query });

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
      content: <CustomerFormModal onCreate={(newId) => methods.setValue('customerId', newId)} />,
    });
  };

  const handleChangeInput = (value: string) => {
    setCustomer((state) => ({ ...state, query: value }));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)} className="h-full flex flex-col justify-between">
        <div className="space-y-1 overflow-y-auto h-full">
          <Controller
            name="customerId"
            control={methods.control}
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

          <Input type="date" defaultValue={currentDate} {...methods.register('purchasedAt', { required: true })} />

          <div className="mt-2">
            <Label>Itens</Label>

            <SaleItemsTable />
          </div>
        </div>

        <div>
          <SaleSummary />

          <InstallmentToggleForm />

          <Button type="submit" isLoading={false} className="w-full mt-4 text-center">
            Finalizar venda
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
