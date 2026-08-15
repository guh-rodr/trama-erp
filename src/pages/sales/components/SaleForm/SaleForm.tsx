import { useCallback, useState } from 'react';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../../../components/Button';
import { useDialog } from '../../../../contexts/dialog/dialog-context';
import { calcSaleSummary } from '../../../../functions/calcSaleSummary';
import { useCreateSale } from '../../../../hooks/useSales';
import { getTodayDate } from '../../../../lib/date';
import { CustomerRow } from '../../../../types/customer';
import { SaleForm } from '../../../../types/sale';
import { SaleFormOverviewTab } from './SaleFormOverviewTab';
import { SalePaymentTab } from './SalePaymentTab';
import { SaleSummary } from './SaleSummary';

interface Props {
  defaultCustomer?: Pick<CustomerRow, 'id' | 'name'>;
  onCreate?: () => void;
}

const currentDate = getTodayDate();

export function SaleFormDrawer({ onCreate, defaultCustomer }: Props) {
  const form = useForm<SaleForm>({
    defaultValues: {
      customerId: defaultCustomer?.id,
      purchasedAt: currentDate,
      items: [{}],
      receivables: [],
      payments: [],
    },
  });

  const onError = useCallback(() => {
    toast.error('Existem campos vazios ou inválidos.', { id: 'form-error' });
  }, []);

  const { mutate } = useCreateSale();
  const { closeDialog } = useDialog();

  const hasErrors = Object.keys(form.formState.errors).length > 0;

  const onSubmit: SubmitHandler<SaleForm> = (data) => {
    const { total, received } = calcSaleSummary({
      entry: data.entry,
      items: data.items,
      payments: data.payments,
      receivables: data.receivables,
    });

    if (received > total || hasErrors) return;

    mutate(data, {
      onSuccess: () => {
        closeDialog();
        onCreate?.();
      },
    });
  };

  const [tab, setTab] = useState<'overview' | 'payment'>('overview');

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="h-full flex flex-col justify-between space-y-4">
        <div className="flex gap-5 border-b pt-4 text-neutral-600 border-neutral-300">
          <button
            type="button"
            onClick={() => setTab('overview')}
            data-enabled={tab === 'overview'}
            className="border-b-2 py-1 border-transparent data-enabled:border-black data-enabled:text-black"
          >
            Geral
          </button>

          <button
            type="button"
            onClick={() => setTab('payment')}
            data-enabled={tab === 'payment'}
            className="border-b-2 py-1 border-transparent data-enabled:border-black data-enabled:text-black"
          >
            Pagamento
          </button>
        </div>

        <div className="h-full">
          <div className={`h-full ${tab === 'overview' ? '' : 'hidden'}`}>
            <SaleFormOverviewTab />
          </div>
          <div className={`h-full ${tab === 'payment' ? '' : 'hidden'}`}>
            <SalePaymentTab />
          </div>
        </div>

        <code>{JSON.stringify(form.formState.errors, null, 2)}</code>
        <div>
          <SaleSummary />

          <Button type="submit" isLoading={false} className="w-full mt-4 text-center">
            Finalizar venda
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
