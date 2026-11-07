import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useReceivablePayments, useReceivableReverse } from '../../../hooks/useReceivables';
import { PaymentReversalForm } from './PaymentReversalForm';

interface Props {
  receivableId: string;
}

export function ReceivableReverseModal({ receivableId }: Props) {
  const { closeDialog } = useDialog();

  const { data: payments, isFetching } = useReceivablePayments({ id: receivableId });
  const { mutate, isPending } = useReceivableReverse();

  return (
    <PaymentReversalForm
      isFetchingPayments={isFetching}
      isSubmitting={isPending}
      payments={payments}
      onSubmit={(data) => mutate({ id: receivableId, ...data }, { onSuccess: () => closeDialog() })}
    />
  );
}
