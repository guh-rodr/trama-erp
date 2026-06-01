import { InfoIcon, PencilIcon, StackPlusIcon, TrashSimpleIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../../../components/Checkbox';
import { formatToReal } from '../../../functions/currency';
import { formatDate } from '../../../functions/formatDate';
import { CustomerRow } from '../../../types/customer';

export const getCustomersColumns = (actions: {
  onEdit: (data: CustomerRow) => void;
  onViewInfo: (id: string) => void;
  onCreateSale: (data: CustomerRow) => void;
  onDelete: (id: string) => void;
}): ColumnDef<CustomerRow>[] => [
  {
    id: 'select',
    size: 10,
    header: ({ table }) => (
      <Checkbox
        {...{
          disabled: table.options.meta?.isFetching,
          checked: table.getIsAllRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ table, row }) => (
      <Checkbox
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect() || table.options.meta?.isFetching,
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  },
  {
    accessorKey: 'name',
    header: 'Nome',
    enableSorting: true,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'phone',
    header: 'Telefone',
    enableSorting: false,
    enableColumnFilter: true,
  },
  {
    accessorKey: 'totalSpent',
    header: 'Total Gasto',
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => <span>{formatToReal((getValue() as number) || 0)}</span>,
  },
  {
    accessorKey: 'debt',
    header: 'Dívida',
    enableSorting: true,
    enableColumnFilter: true,
    cell: ({ getValue }) => <span>{formatToReal((getValue() as number) || 0)}</span>,
  },
  {
    accessorKey: 'lastPurchaseAt',
    header: 'Última compra em',
    enableColumnFilter: true,
    cell: ({ getValue }) => <span>{formatDate(getValue() as Date)}</span>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => actions.onEdit(row.original)}
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 hover:bg-emerald-500 hover:text-white transition-colors"
        >
          <PencilIcon weight="bold" size={16} />
        </button>
        <button
          type="button"
          onClick={() => actions.onViewInfo(row.original.id)}
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 hover:bg-blue-500 hover:text-white transition-colors"
        >
          <InfoIcon weight="bold" size={16} />
        </button>
        <button
          type="button"
          onClick={() => actions.onCreateSale(row.original)}
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 hover:bg-purple-500 hover:text-white transition-colors"
        >
          <StackPlusIcon weight="bold" size={16} />
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
