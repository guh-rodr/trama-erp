import { PencilIcon, TrashSimpleIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../../../components/Checkbox';
import { formatToReal } from '../../../functions/currency';
import { formatDate } from '../../../functions/formatDate';
import { TransactionRow } from '../../../types/transaction';
import { TRANSACTION_CATEGORIES } from '../../../utils/transactionCategories';
import { TransactionFlowBadge } from './TransactionTypeBadge';

export const getCashflowColumns = (actions: {
  onEdit: (data: TransactionRow) => void;
  onDelete: (id: string, isSale: boolean) => void;
  onViewSaleInfo: (id: string) => void;
}): ColumnDef<TransactionRow>[] => [
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
    accessorKey: 'description',
    header: 'Descrição',
    enableSorting: false,
    cell: ({ getValue, row }) =>
      row.original.saleId ? (
        <button
          type="button"
          onClick={() => actions.onViewSaleInfo(row.original.saleId!)}
          className="underline underline-offset-2 flex items-center gap-1"
        >
          {getValue() as string}
        </button>
      ) : (
        <span>{getValue() as string}</span>
      ),
  },
  {
    accessorKey: 'flow',
    enableSorting: true,
    header: 'Fluxo',
    cell: ({ getValue }) => <TransactionFlowBadge flow={getValue() as 'inflow' | 'outflow'} size="xs" />,
  },
  {
    accessorKey: 'value',
    header: 'Valor',
    cell: ({ getValue }) => <span>{formatToReal(getValue() as number)}</span>,
  },
  {
    accessorKey: 'category',
    enableSorting: false,
    header: 'Categoria',
    cell: ({ getValue, row }) => {
      const categoryName = TRANSACTION_CATEGORIES[row.original.flow].find(
        (c) => c.value === (getValue() as string),
      )?.label;

      return categoryName;
    },
  },
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ getValue }) => <span>{formatDate(getValue() as Date)}</span>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          disabled={!!row.original.saleId}
          title={row.original.saleId ? 'Essa transação tem uma venda relacionada' : undefined}
          onClick={() => actions.onEdit(row.original)}
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 enabled:hover:bg-emerald-500 enabled:hover:text-white disabled:opacity-60 disabled:!cursor-not-allowed transition-colors"
        >
          <PencilIcon weight="bold" size={16} />
        </button>
        <button
          type="button"
          onClick={() => actions.onDelete(row.original.id, !!row.original.saleId)}
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 hover:bg-red-500 hover:text-white transition-colors"
        >
          <TrashSimpleIcon weight="bold" size={16} />
        </button>
      </div>
    ),
  },
];
