import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../../components/Button';
import { Checkbox } from '../../../components/Checkbox';
import { ErrorNotification } from '../../../components/ErrorNotification';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { convertToCents, formatToReal } from '../../../functions/currency';
import { formatDate } from '../../../functions/formatDate';
import { useCreateReceivablesPayments, useCustomerReceivables } from '../../../hooks/useReceivables';
import { AccountPaymentForm } from '../../../types/receivables';
import { PaymentFormFields } from '../../receivables/components/PaymentFormFields';

interface Props {
  id: string;
}

export function CustomerInfoReceivables({ id }: Props) {
  const { data, isLoading, isError, isSuccess, refetch } = useCustomerReceivables({ id });
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const { control, handleSubmit, reset } = useForm<AccountPaymentForm>();
  const { mutate } = useCreateReceivablesPayments();

  const handleToggle = (id: string) => {
    if (selected[id]) {
      setSelected((current) => ({ ...current, [id]: false }));
    } else {
      setSelected((current) => ({ ...current, [id]: true }));
    }
  };

  const isAllSelected = (data ?? []).length > 0 && (data ?? []).every((row) => selected[row.id]);

  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelected({});
    } else {
      const newSelections: typeof selected = {};
      data!.forEach((row) => {
        newSelections[row.id] = true;
      });
      setSelected(newSelections);
    }
  };

  const selectedTotal = useMemo(
    () =>
      (data ?? [])
        .filter((account) => !!selected[account.id])
        .reduce((sum, account) => sum + account.total - account.paid, 0),
    [data, selected],
  );

  const onSubmit: SubmitHandler<AccountPaymentForm> = (data) => {
    if (!data.method || !data.value || convertToCents(data.value) <= 0) {
      toast.error('Informe a forma e o valor do pagamento.');
      return;
    }
    if (convertToCents(data.value) > selectedTotal) {
      toast.error('O valor excede o saldo das contas selecionadas.');
      return;
    }

    const receivables = Object.entries(selected).map((e) => (e[1] ? e[0] : undefined)) as string[];

    mutate(
      { ...data, receivables, customerId: id },
      {
        onSuccess: () => {
          reset();
          setSelected({});
          refetch();
        },
      },
    );
  };

  return (
    <div className="mt-4 space-y-3">
      {isLoading && <LoadingNotification />}
      {isError && <ErrorNotification />}

      {!isLoading && !isError && isSuccess && (
        <>
          {data.length === 0 ? (
            <p className="text-center text-neutral-400">Esse cliente não possui nenhuma conta pendente</p>
          ) : (
            <>
              <table className="rounded-xl text-left bg-white shadow-sm w-full">
                <thead>
                  <tr className="text-neutral-800 uppercase text-xs *:p-3">
                    <th>
                      <Checkbox checked={isAllSelected} onChange={handleToggleAll} />
                    </th>
                    <th>Origem</th>
                    <th>Dívida</th>
                    <th>Vencimento</th>
                  </tr>
                </thead>

                <tbody className="relative">
                  {data.map((r) => (
                    <tr className="border-y border-neutral-200 text-neutral-600 text-sm relative *:p-3">
                      <td>
                        <Checkbox checked={!!selected[r.id]} onChange={() => handleToggle(r.id)} />
                      </td>
                      <td>{r.description}</td>
                      <td>{formatToReal(r.total - r.paid)}</td>
                      <td>{r.dueAt ? formatDate(r.dueAt) : 'Sem vencimento'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 border-t border-neutral-200 pt-3">
                <PaymentFormFields control={control} sum={selectedTotal} />

                <p className="text-sm text-neutral-500">
                  O valor será aplicado das contas mais antigas para as mais novas.
                </p>

                <Button type="submit" disabled={!selectedTotal} className="w-full">
                  Registrar pagamento
                </Button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}
