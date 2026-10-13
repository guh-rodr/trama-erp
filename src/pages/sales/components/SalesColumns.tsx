import { InfoIcon, TrashSimpleIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../../../components/Checkbox';
import { formatToReal } from '../../../functions/currency';
import { formatDate } from '../../../functions/formatDate';
import { ContactRow } from '../../../types/contact';
import { SaleRow, SaleStatus } from '../../../types/sale';
import { SaleStatusBadge } from './SaleStatusBadge';
import { ContactRow } from '../../../types/contact';

export const getSalesColumns = (actions: {
  onViewInfo: (id: SaleRow['id']) => void;
  onDelete: (id: SaleRow['id']) => void;
  onViewCustomerInfo: (id: ContactRow['id']) => void;
}): ColumnDef<SaleRow>[] => [
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
    header: 'Cliente',
    accessorKey: 'customer.name',
    enableSorting: false,
    cell: ({ getValue, row }) =>
      getValue() ? (
        <button
          type="button"
          onClick={() => actions.onViewCustomerInfo(row.original.customer!.id)}
          className="underline underline-offset-2 flex items-center gap-1"
        >
          {getValue() as string}
        </button>
      ) : (
        '[Cliente não informado]'
      ),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    enableSorting: false,
    cell: ({ getValue }) => <SaleStatusBadge status={getValue() as SaleStatus} size="xs" />,
  },
  {
    header: 'Itens',
    id: 'itemCount',
    accessorKey: 'itemCount',
    enableSorting: true,
    cell: ({ getValue }) => (
      <div style={{ marginLeft: String(getValue() as number).length * 14 }}>{getValue() as number}</div>
    ),
  },
  {
    header: 'Valor total',
    accessorKey: 'total',
    enableSorting: true,
    cell: ({ getValue }) => <span>{formatToReal(getValue() as number)}</span>,
  },
  {
    header: 'Lucro total',
    accessorKey: 'profit',
    enableSorting: true,
    cell: ({ getValue }) =>
      (getValue() as number) > -1 ? (
        <span className="text-emerald-500">+ {formatToReal(getValue() as number)}</span>
      ) : (
        <span className="text-red-500">- {formatToReal(Math.abs(getValue() as number))}</span>
      ),
  },
  {
    header: 'Data',
    accessorKey: 'purchasedAt',
    enableSorting: true,
    cell: ({ getValue }) => <span>{formatDate(getValue() as Date)}</span>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => actions.onViewInfo(row.original.id)}
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 hover:bg-blue-500 hover:text-white transition-colors"
        >
          <InfoIcon weight="bold" size={16} />
        </button>
        <button
          type="button"
          onClick={() => actions.onDelete(row.original.id)}
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 hover:bg-red-500 hover:text-white transition-colors"
        >
          <TrashSimpleIcon weight="bold" size={16} />
        </button>
      </div>
    ),
  },
];
