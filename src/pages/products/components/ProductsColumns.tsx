import { PencilIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '../../../components/Checkbox';
import { formatToReal } from '../../../functions/currency';
import { CategoryItem } from '../../../types/category';
import { ProductRow } from '../../../types/product';

export const getProductsColumns = (actions: {
  onEdit: (rowId: string, category: Pick<CategoryItem, 'id' | 'name'>) => void;
}): ColumnDef<ProductRow>[] => [
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
    accessorKey: 'name',
    enableSorting: false,
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    header: 'Categoria',
    accessorKey: 'category.name',
    enableSorting: false,
    cell: ({ getValue }) => <span>{getValue() as string}</span>,
  },
  {
    header: 'Variantes',
    accessorKey: 'variantCount',
    enableSorting: true,
    cell: ({ getValue, row }) => (
      <span>
        {row.original.isVariable
          ? `${getValue() as number} ${(getValue() as number) > 1 ? 'variantes' : 'variante'}`
          : 'Sem variante'}
      </span>
    ),
  },
  {
    header: 'Estoque total',
    accessorKey: 'quantity',
    enableSorting: true,
    cell: ({ getValue }) => <span>{getValue() as number}</span>,
  },
  {
    header: 'Preço (de/até)',
    enableSorting: false,
    cell: ({ row }) => (
      <span>
        {row.original.minSalePrice === row.original.maxSalePrice
          ? formatToReal(row.original.minSalePrice)
          : `${formatToReal(row.original.minSalePrice)} até ${formatToReal(row.original.maxSalePrice)}`}
      </span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => actions.onEdit(row.original.id, row.original.category)}
          className="p-1 cursor-pointer text-neutral-400 rounded-lg border border-neutral-300 bg-neutral-50 hover:bg-emerald-500 hover:text-white transition-colors"
        >
          <PencilIcon weight="bold" size={16} />
        </button>
      </div>
    ),
  },
];
