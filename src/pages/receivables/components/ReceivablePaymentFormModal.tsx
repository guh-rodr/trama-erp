import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '../../../components/Button';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { convertToCents } from '../../../functions/currency';
import { useCreateReceivablesPayments } from '../../../hooks/useReceivables';
import { AccountPaymentForm } from '../../../types/receivables';
import { BalanceNotification } from './BalanceNotification';
import { PaymentFormFields } from './PaymentFormFields';

interface Props {
  customerId: string;
  receivableId: string;
  sum: number;
}

export function ReceivablePaymentFormModal({ customerId, receivableId, sum }: Props) {
  const { control, handleSubmit } = useForm<AccountPaymentForm>();
  const { closeDialog } = useDialog();
  const value = useWatch({ control, name: 'value' });

  const balance = sum - convertToCents(value);

  const { mutate, isPending } = useCreateReceivablesPayments();

  const onError = () => {
    toast.error('Existem campos vazios ou inválidos.', { id: 'form-error' });
  };

  const onSubmit: SubmitHandler<AccountPaymentForm> = (data) => {
    mutate(
      { ...data, customerId, receivables: [receivableId] },
      {
        onSuccess: () => {
          closeDialog();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <PaymentFormFields control={control} sum={sum} />
      <BalanceNotification control={control} total={sum} />

      <div className="flex gap-2 mt-6 *:flex-1">
        <Button type="button" variant="outline" onClick={() => closeDialog()}>
          Cancelar
        </Button>
        <Button isLoading={isPending} disabled={balance < 0}>
          Confirmar
        </Button>
      </div>
    </form>
  );
}
