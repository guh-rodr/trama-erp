import { RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { FilterForm } from '../../../components/Filter/Filter';
import { TableBody } from '../../../components/Table/TableBody';
import { TableFooter } from '../../../components/Table/TableFooter';
import { TableHeader } from '../../../components/Table/TableHeader';
import { TableRowsSkeleton } from '../../../components/TableRowsSkeleton';
import { useFetchTableSales } from '../../../hooks/useSales';
import { useTableHelper } from '../../../hooks/useTableHelper';
import { getSalesColumns } from './SalesColumns';

type RowActions = Parameters<typeof getSalesColumns>[0];

interface Props extends RowActions {
  filter: FilterForm;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
}

export function SalesTable({
  filter,
  selectedRows,
  onSelectionChange,
  onViewInfo,
  onViewCustomerInfo,
  onDelete,
}: Props) {
  const { data, isFetching, isError, refetch } = useFetchTableSales(filter);
  const columns = useMemo(() => getSalesColumns({ onViewInfo, onDelete, onViewCustomerInfo }), []);

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
    <table className="min-w-full min-h-full divide-y divide-neutral-200 rounded-xl overflow-hidden shadow-sm">
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
