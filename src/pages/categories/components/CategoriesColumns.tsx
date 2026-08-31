import { PencilIcon, TrashSimpleIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../../../components/Checkbox';
import { CategoryForm, CategoryRow } from '../../../types/category';

export const getCategoriesColumns = (actions: {
  onEdit: (data: CategoryForm) => void;
  onDelete: (row: CategoryRow) => void;
}): ColumnDef<CategoryRow>[] => [
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
    header: 'Qntd. Produtos',
    accessorKey: 'productCount',
    enableSorting: true,
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
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
          onClick={() => actions.onDelete(row.original)}
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 hover:bg-red-500 hover:text-white transition-colors"
        >
          <TrashSimpleIcon weight="bold" size={16} />
        </button>
      </div>
    ),
  },
];
