import { SaleStatus } from '../../../types/sale';

interface Style {
  label: string;
  styles: string;
}

const STYLES: Record<SaleStatus, Style> = {
  PENDING: {
    label: 'Pendente',
    styles: 'bg-neutral-200/30 text-neutral-500 border-neutral-200',
  },
  PARTIAL: {
    label: 'Parcial',
    styles: 'bg-amber-200/30 text-amber-500 border-amber-200',
  },
  PAID: {
    label: 'Pago',
    styles: 'bg-emerald-200/30 text-emerald-500 border-emerald-200',
  },
};

const SIZES = {
  xs: 'text-xs font-medium',
  sm: 'text-sm',
};

interface Props {
  status: SaleStatus;
  size: 'xs' | 'sm';
}

export function SaleStatusBadge({ status, size }: Props) {
  const { label, styles } = STYLES[status];
  const textSize = SIZES[size];

  return <span className={`py-0.5 px-2 rounded-2xl border ${textSize} ${styles}`}>{label}</span>;
}
