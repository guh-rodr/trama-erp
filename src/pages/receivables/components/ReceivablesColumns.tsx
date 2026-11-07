import {
  ArrowUUpLeftIcon,
  ChecksIcon,
  CurrencyDollarSimpleIcon,
  PencilIcon,
  ProhibitIcon,
  TrashSimpleIcon,
} from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { ComponentProps } from 'react';
import { Badge } from '../../../components/Badge';
import { Checkbox } from '../../../components/Checkbox';
import { formatToReal } from '../../../functions/currency';
import { formatDate } from '../../../functions/formatDate';
import { ReceivableForm, ReceivableRow } from '../../../types/receivables';

const statusMap = {
  PENDING: { label: 'Pendente', badgeColor: 'default' },
  PARTIAL: { label: 'Parcial', badgeColor: 'warning' },
  PAID: { label: 'Pago', badgeColor: 'success' },
  CANCELLED: { label: 'Cancelado', badgeColor: 'error' },
};

export const getReceivablesColumns = (actions: {
  onCreatePayment: (id: string, customerId: string, sum: number) => void;
  onReverse: (id: string) => void;
  onEdit: (data: ReceivableForm) => void;
  onCancel: (id: string) => void;
  onUncancel: (id: string) => void;
  onDelete: (id: string) => void;
}): ColumnDef<ReceivableRow>[] => [
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
    accessorKey: 'customerName',
    enableSorting: false,
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    header: 'Descrição',
    accessorKey: 'description',
    enableSorting: false,
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    header: 'Status',
    accessorKey: 'status',
    enableSorting: true,
    cell: ({ getValue }) => {
      const { label, badgeColor } = statusMap[getValue() as keyof typeof statusMap];

      return <Badge color={badgeColor as ComponentProps<typeof Badge>['color']}>{label}</Badge>;
    },
  },
  {
    header: 'Total',
    accessorKey: 'total',
    enableSorting: true,
    cell: ({ getValue }) => <span>{formatToReal(getValue() as number)}</span>,
  },
  {
    header: 'Pago',
    accessorKey: 'paid',
    enableSorting: true,
    cell: ({ getValue }) => <span>{formatToReal(getValue() as number)}</span>,
  },
  {
    header: 'Vencimento',
    accessorKey: 'dueAt',
    enableSorting: true,
    cell: ({ getValue }) => <span>{formatDate(getValue() as string)}</span>,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          disabled={row.original.paid === row.original.total || row.original.status === 'CANCELLED'}
          onClick={() =>
            actions.onCreatePayment(row.original.id, row.original.customerId!, row.original.total - row.original.paid)
          }
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 enabled:hover:bg-emerald-500 enabled:hover:text-white disabled:opacity-40 disabled:!cursor-not-allowed transition-colors"
        >
          <CurrencyDollarSimpleIcon weight="bold" size={16} />
        </button>

        <button
          type="button"
          disabled={row.original.paid === 0 && row.original.paid <= row.original.total}
          onClick={() => actions.onReverse(row.original.id)}
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 enabled:hover:bg-amber-500 enabled:hover:text-white disabled:opacity-40 disabled:!cursor-not-allowed transition-colors"
        >
          <ArrowUUpLeftIcon weight="bold" size={16} />
        </button>

        <button
          type="button"
          disabled={row.original.status !== 'PENDING' || !!row.original.saleId}
          onClick={() =>
            actions.onEdit({
              id: row.original.id,
              customerId: row.original.customerId!,
              customerName: row.original.customerName!,
              description: row.original.description,
              dueAt: row.original.dueAt?.split('T')[0],
              occurredAt: row.original.occurredAt.split('T')[0],
              total: row.original.total,
            })
          }
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 enabled:hover:bg-blue-500 enabled:hover:text-white disabled:opacity-40 disabled:!cursor-not-allowed transition-colors"
        >
          <PencilIcon weight="bold" size={16} />
        </button>

        {row.original.hasFinancialLog || row.original.saleId ? (
          <>
            {row.original.status === 'CANCELLED' ? (
              <button
                type="button"
                onClick={() => actions.onUncancel(row.original.id)}
                className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 enabled:hover:bg-lime-500 enabled:hover:text-white disabled:opacity-40 disabled:!cursor-not-allowed transition-colors"
              >
                <ChecksIcon weight="bold" size={16} />
              </button>
            ) : (
              <button
                type="button"
                disabled={row.original.status !== 'PENDING'}
                onClick={() => actions.onCancel(row.original.id)}
                className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 enabled:hover:bg-red-500 enabled:hover:text-white disabled:opacity-40 disabled:!cursor-not-allowed transition-colors"
              >
                <ProhibitIcon weight="bold" size={16} />
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            disabled={row.original.status !== 'PENDING'}
            onClick={() => actions.onDelete(row.original.id)}
            className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 enabled:hover:bg-red-500 enabled:hover:text-white disabled:opacity-40 disabled:!cursor-not-allowed transition-colors"
          >
            <TrashSimpleIcon weight="bold" size={16} />
          </button>
        )}
      </div>
    ),
  },
];
