import { ColumnDef } from '@tanstack/react-table';
import { ComponentProps } from 'react';
import { Badge } from '../../../components/Badge';
import { Checkbox } from '../../../components/Checkbox';
import { formatToReal } from '../../../functions/currency';
import { formatDate } from '../../../functions/formatDate';
import { ProductVariant } from '../../../types/product';
import { StockMovementRow } from '../../../types/stock-movement';
import { COLORS } from '../../../utils/colors';

const typeMap = {
  ENTRY: { label: 'Entrada', badgeColor: 'success', symbol: '+', textColor: 'text-emerald-500' },
  EXIT: { label: 'Saída', badgeColor: 'error', symbol: '-', textColor: 'text-red-500' },
};

const originMap = {
  MANUAL: { label: 'Manual', badgeColor: 'default' },
  PURCHASE: { label: 'Compra', badgeColor: 'default' },
  SALE: { label: 'Venda', badgeColor: 'default' },
};

export const getStockMovementsColumns = (canShowBalanceCol: boolean): ColumnDef<StockMovementRow>[] => [
  {
    id: 'select',
    size: 10,
    header: ({ table }) => (
      <Checkbox
        {...{
          checked: table.getIsAllRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  },
  {
    header: 'Produto',
    accessorKey: 'product.name',
    enableSorting: false,
    cell: ({ getValue, row }) => {
      const getVariantName = (variant: Partial<ProductVariant>) => {
        const getColorName = () => COLORS.find((c) => c.value === variant.color)?.label;
        const variantName = !variant.color ? 'Padrão' : `${getColorName()} ∙ ${variant.size!.toUpperCase()}`;

        return variantName;
      };

      return (
        <span className="flex flex-col">
          {getValue() as string}{' '}
          {row.original.variant.color && (
            <span className="text-neutral-400">{getVariantName(row.original.variant)}</span>
          )}
        </span>
      );
    },
  },
  {
    header: 'Tipo',
    accessorKey: 'type',
    enableSorting: true,
    cell: ({ getValue }) => {
      const { label, badgeColor } = typeMap[getValue() as keyof typeof typeMap];

      return <Badge color={badgeColor as ComponentProps<typeof Badge>['color']}>{label}</Badge>;
    },
  },
  {
    header: 'Qntd.',
    accessorKey: 'quantity',
    enableSorting: true,
    cell: ({ getValue, row }) => {
      const { symbol, textColor } = typeMap[row.original.type];

      return (
        <span className={textColor}>
          {symbol}
          {getValue() as number}
        </span>
      );
    },
  },
  {
    header: 'Custo un.',
    accessorKey: 'unitCost',
    enableSorting: true,
    cell: ({ getValue }) => <span>{getValue() ? formatToReal(getValue() as number) : ''}</span>,
  },
  {
    header: 'Origem',
    accessorKey: 'origin',
    enableSorting: true,
    cell: ({ getValue }) => {
      const { label, badgeColor } = originMap[getValue() as keyof typeof originMap];

      return <Badge color={badgeColor as ComponentProps<typeof Badge>['color']}>{label}</Badge>;
    },
  },
  ...(canShowBalanceCol
    ? [
        {
          header: 'Saldo após',
          accessorKey: 'balance',
          enableSorting: true,
          cell: ({ getValue }) => <span>{getValue() as number}</span>,
        } satisfies ColumnDef<StockMovementRow>,
      ]
    : []),
  {
    header: 'Motivo',
    accessorKey: 'reason',
    enableSorting: false,
    cell: ({ getValue }) => (
      <span title={getValue() as string} className="!truncate block max-w-[210px]">
        {getValue() as string}
      </span>
    ),
  },
  {
    header: 'Data',
    accessorKey: 'date',
    enableSorting: true,
    cell: ({ getValue }) => <span>{formatDate(getValue() as string)}</span>,
  },
  {
    id: 'actions',
    header: '',
  },
];
