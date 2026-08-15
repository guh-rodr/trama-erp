import { get } from 'react-hook-form';
import { SaleForm } from '../types/sale';
import { convertToCents } from './currency';

function calcSaleTotal(items: SaleForm['items']) {
  const result = items.reduce((acc, item) => {
    const salePrice = convertToCents(get(item, 'salePrice') || 0);

    acc += salePrice;
    return acc;
  }, 0);

  return result;
}

function calcTotalToReceive(form: Pick<SaleForm, 'entry' | 'payments' | 'receivables'>) {
  const entryPaid = convertToCents(form.entry?.value ?? 0);
  const paymentsTotal = form.payments.reduce((prev, curr) => prev + convertToCents(curr.value ?? 0), 0);
  const receivablesTotal = form.receivables.reduce((prev, curr) => prev + convertToCents(curr.value ?? 0), 0);

  const calc = entryPaid + paymentsTotal + receivablesTotal;

  return calc;
}

interface SummaryProps {
  items: SaleForm['items'];
  entry: SaleForm['entry'];
  payments: SaleForm['payments'];
  receivables: SaleForm['receivables'];
}

export function calcSaleSummary(props: SummaryProps) {
  const total = calcSaleTotal(props.items);
  const received = calcTotalToReceive(props);

  return { total, received };
}
