import { format } from 'date-fns';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { Button } from '../../../components/Button';
import { Checkbox } from '../../../components/Checkbox';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { formatToReal } from '../../../functions/currency';
import { getTodayDate } from '../../../lib/date';
import { ReceivablePayment, ReceivableReverseForm } from '../../../types/receivables';

interface Props {
  isFetchingPayments: boolean;
  isSubmitting: boolean;
  payments?: ReceivablePayment[];
  onSubmit: (data: ReceivableReverseForm) => void;
}

const currentDate = getTodayDate();

const paymentMethodsMap = {
  CASH: 'Dinheiro',
  PIX: 'Pix',
  CREDIT_CARD: 'Cartão de crédito',
  DEBIT_CARD: 'Cartão de débito',
};

export function PaymentReversalForm({ isFetchingPayments, isSubmitting, payments, onSubmit }: Props) {
  const { closeDialog } = useDialog();

  const { control, register, setValue, handleSubmit } = useForm<ReceivableReverseForm>({
    defaultValues: {
      allocations: [],
      date: currentDate,
    },
  });

  const selectedAllocations = useWatch({ control, name: 'allocations' });
  const isAllSelected = selectedAllocations?.length === payments?.length;

  const totalSelected = useMemo(
    () => payments?.filter((p) => selectedAllocations.includes(p.id)).reduce((sum, p) => sum + p.total, 0) ?? 0,
    [payments, selectedAllocations],
  );

  const handleToggleAllSelections = () => {
    if (isAllSelected) {
      setValue('allocations', []);
    } else {
      setValue('allocations', payments?.map((r) => r.id) ?? []);
    }
  };

  if (isFetchingPayments) {
    return <LoadingNotification />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="flex gap-3 *:flex-1">
          <div>
            <Label>Motivo</Label>
            <Controller
              control={control}
              name="reason"
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  value={field.value}
                  onChangeOption={field.onChange}
                  readOnly
                  placeholder="Selecione um motivo..."
                  options={[
                    { label: 'Reembolso', value: 'REVERSAL_REFUND' },
                    { label: 'Correção', value: 'REVERSAL_CORRECTION' },
                  ]}
                />
              )}
            />
          </div>

          <div>
            <Label>Data</Label>
            <Input type="date" id="date" {...register('date')} />
          </div>
        </div>

        <div>
          <Label>Registros</Label>

          <div className="rounded-xl overflow-hidden border border-neutral-200/80">
            <table className="text-left bg-white shadow-sm w-full">
              <thead>
                <tr className="text-neutral-800 uppercase text-xs *:p-3">
                  <th>
                    <Checkbox checked={isAllSelected} onChange={handleToggleAllSelections} />
                  </th>
                  <th>Método</th>
                  <th>Valor</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody className="relative">
                {payments?.map((payment) => {
                  const date = payment.createdAt ? format(new Date(payment.createdAt), 'dd/MM/yy') : '';
                  const method = paymentMethodsMap[payment.method];

                  return (
                    <tr
                      key={payment.id}
                      className="border-y border-neutral-200 text-neutral-600 text-sm relative *:p-3"
                    >
                      <td>
                        <Checkbox
                          value={payment.id}
                          {...register('allocations', { validate: (value) => value.length >= 1 })}
                        />
                      </td>

                      <td>{method}</td>

                      <td>{formatToReal(payment.total)}</td>

                      <td>{date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {totalSelected > 0 && (
          <p className="text-xs text-neutral-500 font-medium">Total: {formatToReal(totalSelected)}</p>
        )}

        <div className="flex items-center justify-between gap-2 !space-y-0 *:w-full">
          <Button type="button" variant="outline" onClick={() => closeDialog()}>
            Cancelar
          </Button>

          <Button type="submit" isLoading={isSubmitting}>
            Confirmar
          </Button>
        </div>
      </div>
    </form>
  );
}
