import { get, useFormContext, useWatch } from 'react-hook-form';
import { convertToCents, formatToReal } from '../../../../functions/currency';
import { SaleForm } from '../../../../types/sale';

export function SaleSummary() {
  const { control } = useFormContext<SaleForm>();
  const items = useWatch({ control, name: 'items' });

  const installment = useWatch({ control, name: 'installment' }) || {
    value: 0,
    paidAt: '',
  };

  const summary = items.reduce(
    (acc, item) => {
      const costPrice = convertToCents(get(item, 'costPrice') || 0);
      const salePrice = convertToCents(get(item, 'salePrice') || 0);

      acc.total += salePrice;
      acc.profit += salePrice - costPrice;
      return acc;
    },
    { total: 0, profit: 0 },
  );

  const installmentValueCents = convertToCents(installment.value || 0);
  const receivableTotal = installment.value ? installmentValueCents : summary.total;

  let receivableProfit = summary.profit;

  if (installment.value && summary.total > 0) {
    receivableProfit = Math.round((installmentValueCents * summary.profit) / summary.total);
  }

  return (
    <div className="pt-4">
      <div>
        <div className="flex justify-between items-center">
          Valor total
          <span className="text-neutral-600">{formatToReal(summary.total)}</span>
        </div>

        <div className="flex justify-between items-center">
          Valor a receber
          <span className="text-neutral-600">{formatToReal(receivableTotal)}</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center">
          Lucro total
          <span className="text-neutral-600">{formatToReal(summary.profit)}</span>
        </div>

        <div className="flex justify-between items-center">
          Lucro a receber
          <span className="text-neutral-600">{formatToReal(receivableProfit)}</span>
        </div>
      </div>
    </div>
  );
}
