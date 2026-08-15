import { useFormContext, useWatch } from 'react-hook-form';
import { calcSaleSummary } from '../../../../functions/calcSaleSummary';
import { formatToReal } from '../../../../functions/currency';
import { SaleForm } from '../../../../types/sale';

export function SaleSummary() {
  const { control } = useFormContext<SaleForm>();

  const [items, entry, receivables, payments] = useWatch({
    control,
    name: ['items', 'entry', 'receivables', 'payments'],
  });

  const { total, received } = calcSaleSummary({ items, entry, receivables, payments });

  return (
    <div className="pt-4">
      <div>
        <div className="flex justify-between items-center">
          Valor total
          <span className="text-neutral-600">{formatToReal(total)}</span>
        </div>

        <div className="flex justify-between items-center">
          Valor a receber
          <span className="text-neutral-600">{formatToReal(received)}</span>
        </div>
      </div>
    </div>
  );
}
