import { ChecksIcon, InfoIcon, PencilIcon, ProhibitIcon, TrashSimpleIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '../../../components/Badge';
import { Checkbox } from '../../../components/Checkbox';
import { ContactRow, ContactType } from '../../../types/contact';

export const getContactsColumns = (actions: {
  onEdit: (id: string) => void;
  onViewInfo: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
}): ColumnDef<ContactRow>[] => [
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
    header: 'Nome',
    accessorKey: 'name',
    enableSorting: true,
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },

  {
    header: 'Tipo',
    accessorKey: 'type',
    enableSorting: true,
    cell: ({ getValue }) => {
      const type = getValue() as ContactType;

      return (
        <Badge color={type === 'CUSTOMER' ? 'success' : 'info'}>{type === 'CUSTOMER' ? 'Cliente' : 'Fornecedor'}</Badge>
      );
    },
  },
  {
    header: 'Nota',
    accessorKey: 'note',
    enableSorting: false,
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <span>{value ?? 'Não informado'}</span>;
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => actions.onEdit(row.original.id)}
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 enabled:hover:bg-blue-500 enabled:hover:text-white disabled:opacity-40 disabled:!cursor-not-allowed transition-colors"
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

        {row.original.hasFinancialLog ? (
          <>
            {row.original.deletedAt !== null ? (
              <button
                type="button"
                onClick={() => actions.onUnarchive(row.original.id)}
                className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 enabled:hover:bg-lime-500 enabled:hover:text-white disabled:opacity-40 disabled:!cursor-not-allowed transition-colors"
              >
                <ChecksIcon weight="bold" size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => actions.onArchive(row.original.id)}
                className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 enabled:hover:bg-red-500 enabled:hover:text-white disabled:opacity-40 disabled:!cursor-not-allowed transition-colors"
              >
                <ProhibitIcon weight="bold" size={16} />
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
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
