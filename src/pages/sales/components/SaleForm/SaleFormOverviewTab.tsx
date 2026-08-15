import { PlusIcon, UserIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Autocomplete } from '../../../../components/Autocomplete/Autocomplete';
import { Input } from '../../../../components/Input';
import { Label } from '../../../../components/Label';
import { useDialog } from '../../../../contexts/dialog/dialog-context';
import { useCustomersOptions } from '../../../../hooks/useCustomers';
import { getTodayDate } from '../../../../lib/date';
import { CustomerRow } from '../../../../types/customer';
import { SaleForm } from '../../../../types/sale';
import { CustomerFormModal } from '../../../customers/components/CustomerFormModal';
import { SaleItemsTable } from './SaleItemsTable';

interface Props {
  defaultCustomer?: Pick<CustomerRow, 'id' | 'name'>;
}

const currentDate = getTodayDate();

export function SaleFormOverviewTab({ defaultCustomer }: Props) {
  const [customer, setCustomer] = useState({ id: '', query: '' });
  const { control, setValue, register } = useFormContext<SaleForm>();
  const { openDialog } = useDialog();

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
      content: <CustomerFormModal onCreate={(newId) => setValue('customerId', newId)} />,
    });
  };

  const handleChangeInput = (value: string) => {
    setCustomer((state) => ({ ...state, query: value }));
  };

  return (
    <div className="space-y-4 overflow-y-auto h-full">
      <div className="flex gap-3 *:flex-1">
        <div>
          <Label>Cliente</Label>
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
        </div>

        <div>
          <Label>Data</Label>
          <Input type="date" defaultValue={currentDate} {...register('purchasedAt', { required: true })} />
        </div>
      </div>

      <div className="mt-2">
        <Label>Itens</Label>

        <SaleItemsTable />
      </div>
    </div>
  );
}
