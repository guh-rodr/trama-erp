import { Control, useWatch } from 'react-hook-form';
import { convertToCents, formatToReal } from '../../../functions/currency';
import { AccountPaymentForm } from '../../../types/receivables';

interface Props {
  total: number;
  control: Control<AccountPaymentForm>;
}

export function BalanceNotification({ control, total }: Props) {
  const value = useWatch({ control, name: 'value' });

  if (convertToCents(value) > total) {
    return (
      <span className="text-sm bg-red-200/40 text-red-600 p-2 w-full block rounded-lg border border-red-300 mt-2">
        O valor não pode ultrapassar o total em contas (<strong>{formatToReal(total)}</strong>)
      </span>
    );
  } else {
    const balance = total - convertToCents(value ?? 0);

    return (
      <span className="text-sm bg-amber-200/40 text-amber-600 p-2 w-full block rounded-lg border border-amber-300 mt-2">
        Faltam <span className="font-semibold">{formatToReal(balance)}</span> para cobrir o valor total
      </span>
    );
  }
}
