import { PlusIcon } from '@phosphor-icons/react';
import { addMonths } from 'date-fns';
import { FocusEvent, useMemo } from 'react';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Autocomplete } from '../../../../components/Autocomplete/Autocomplete';
import { Input } from '../../../../components/Input';
import { Label } from '../../../../components/Label';
import { calcSaleSummary } from '../../../../functions/calcSaleSummary';
import { convertToCents, convertToDecimal, formatToReal } from '../../../../functions/currency';
import { SaleForm } from '../../../../types/sale';
import { PaymentEntryContainer } from './PaymentEntryContainer';
import { PaymentsCashTable } from './PaymentsCashTable';
import { PaymentsInstallmentsTable } from './PaymentsInstallmentsTable';

export function SalePaymentTab() {
  const { control, setValue } = useFormContext<SaleForm>();

  const [paymentTerm, items, entry, receivables, payments] = useWatch({
    control,
    name: ['paymentTerm', 'items', 'entry', 'receivables', 'payments'],
  });

  const {
    fields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    control,
    name: 'payments',
    rules: {
      minLength: 1,
      maxLength: 4,
    },
  });

  const { total } = calcSaleSummary({ entry, items, payments, receivables });

  const handleAddPayment = () => {
    if (payments.length === 4) return;
    appendPayment({});
  };

  const reorderReceveibles = (installmentCount: number) => {
    if (installmentCount > 12) {
      installmentCount = 12;
    }

    const entryValueInCents = convertToCents(entry?.value ?? 0);
    const remainingValueInCents = total - entryValueInCents;

    if (entryValueInCents > total) return;

    const baseInstallmentCents = Math.floor(remainingValueInCents / installmentCount);
    const remainderCents = remainingValueInCents % installmentCount;

    const newReceivables = Array.from({ length: installmentCount }).map((_, idx) => {
      const futureDate = addMonths(new Date(), idx + 1);
      const defaultDate = futureDate.toISOString().split('T')[0];

      const getsExtraCent = idx >= installmentCount - remainderCents;
      const valueInCents = baseInstallmentCents + (getsExtraCent ? 1 : 0);

      return {
        value: total === 0 ? undefined : convertToDecimal(valueInCents),
        dueDate: defaultDate,
      };
    });

    setValue('receivables', newReceivables);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const installmentCount = +(event.target.value ?? 0);

    reorderReceveibles(installmentCount);
  };

  const paymentsTotal = payments.reduce((prev, curr) => prev + convertToCents(curr.value ?? 0), 0);
  const entryPaid = convertToCents(entry?.value ?? 0);
  const receivableTotal =
    entryPaid + paymentsTotal + receivables.reduce((prev, curr) => prev + convertToCents(curr.value ?? 0), 0);

  const balance = total - receivableTotal;

  const isEmptyItems = useMemo(() => items.every((i) => !i.variantId), [items]);

  if (isEmptyItems) {
    return (
      <span className="text-sm bg-amber-200/40 text-amber-600 p-2 w-full block rounded-lg border border-amber-300">
        Adicione ao menos um item para prosseguir com o pagamento
      </span>
    );
  }

  const handleBlurEntryInput = () => {
    if (paymentTerm !== 'INSTALLMENT') return;

    reorderReceveibles(receivables.length);
  };

  return (
    <div className="h-full space-y-2">
      <div className="flex gap-3 [&>div]:flex-1">
        <div className="space-y-1">
          <Label className="p-0">Condição</Label>

          <Controller
            control={control}
            name="paymentTerm"
            rules={{ required: true }}
            render={({ field }) => (
              <Autocomplete
                value={field.value}
                readOnly
                placeholder="Condição"
                onChangeOption={(value) => {
                  field.onChange(value);
                  control.unregister('entry');

                  if (value === 'CASH') {
                    setValue('payments', [{}]);
                    setValue('receivables', []);
                  } else if (value === 'INSTALLMENT') {
                    setValue('payments', []);
                    reorderReceveibles(1);
                  } else {
                    setValue('payments', []);
                    setValue('receivables', []);
                  }
                }}
                options={[
                  { label: 'À vista', value: 'CASH' },
                  { label: 'Crediário', value: 'INSTALLMENT' },
                  { label: 'Conta corrente', value: 'TAB' },
                ]}
              />
            )}
          />
        </div>

        {paymentTerm === 'INSTALLMENT' && (
          <div className="space-y-1">
            <Label className="p-0">Parcelas</Label>

            <Input
              type="number"
              defaultValue={receivables.length}
              min={1}
              max={12}
              onBlur={handleBlur}
              className="flex-1"
              placeholder="N. Parcelas"
            />
          </div>
        )}
      </div>

      {paymentTerm === 'CASH' && (
        <div className="flex items-center justify-between mt-4">
          <Label className="p-0">Pagamento</Label>

          <button
            className="text-emerald-500 text-sm whitespace-nowrap transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
            type="button"
            onClick={handleAddPayment}
          >
            <PlusIcon weight="bold" /> Novo pagamento
          </button>
        </div>
      )}

      {paymentTerm === 'INSTALLMENT' && <PaymentsInstallmentsTable reorderReceveibles={reorderReceveibles} />}

      {paymentTerm === 'CASH' && <PaymentsCashTable payments={fields} removePayment={removePayment} total={total} />}

      {paymentTerm === 'TAB' && <PaymentEntryContainer onBlurValue={handleBlurEntryInput} control={control} />}

      {balance < 0 && (
        <span className="text-sm bg-red-200/40 text-red-600 p-2 w-full block rounded-lg border border-red-300 mt-2">
          Os pagamentos não podem ultrapassar o valor total
        </span>
      )}

      {balance > 0 && (
        <span className="text-sm bg-amber-200/40 text-amber-600 p-2 w-full block rounded-lg border border-amber-300 mt-2">
          Faltam <span className="font-semibold">{formatToReal(balance)}</span> para cobrir o valor total
        </span>
      )}
    </div>
  );
}
