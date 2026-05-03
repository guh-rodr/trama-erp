import { RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FilterForm } from '../../../components/Filter/Filter';
import { TableBody } from '../../../components/Table/TableBody';
import { TableFooter } from '../../../components/Table/TableFooter';
import { TableHeader } from '../../../components/Table/TableHeader';
import { TableRowsSkeleton } from '../../../components/TableRowsSkeleton';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useFetchTableProducts } from '../../../hooks/useProducts';
import { useTableHelper } from '../../../hooks/useTableHelper';
import { CategoryItem } from '../../../types/category';
import { ProductDeleteModal } from './ProductDeleteModal';
import { ProductFormDrawer } from './ProductFormDrawer';
import { getProductsColumns } from './ProductsColumns';

interface Props {
  filter: FilterForm;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
}

export function ProductsTable({ filter, selectedRows, onSelectionChange }: Props) {
  const { openDialog } = useDialog();

  const onEdit = (rowId: string, category: Pick<CategoryItem, 'id' | 'name'>) => {
    openDialog({
      title: 'Editar informações do produto',
      type: 'drawer',
      content: <ProductFormDrawer defaultProductId={rowId} defaultCategory={category} />,
    });
  };

  const onDelete = (rowId: string, rowName: string) => {
    openDialog({
      title: 'Confirmação',
      type: 'modal',
      content: <ProductDeleteModal productId={rowId} productName={rowName} />,
    });
  };

  const { data, isFetching, isError, refetch } = useFetchTableProducts(filter);
  const columns = useMemo(() => getProductsColumns({ onEdit, onDelete }), []);

  const table = useTableHelper({
    columns,
    data: data?.rows || [],
    pageCount: data?.pageCount || 0,
    rowCount: data?.rowCount || 0,
    getRowId: (data) => data.id,
    onRowSelectionChange: onSelectionChange,
    state: { rowSelection: selectedRows },
    meta: { isFetching },
  });

  return (
    <table className="min-w-full min-h-full divide-y divide-neutral-200 rounded-xl overflow-hidden shadow-sm !table-fixed w-full">
      <>
        <TableHeader table={table} />
        {isFetching ? (
          <tbody>
            <TableRowsSkeleton columnCount={columns.length - 1} />
          </tbody>
        ) : (
          <TableBody table={table} isError={isError} columnsLength={columns.length} refetch={refetch} />
        )}
      </>
      {!isFetching && <TableFooter table={table} />}
    </table>
  );
}
