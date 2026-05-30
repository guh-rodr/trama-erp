import { RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { TableBody } from '../../../components/Table/TableBody';
import { TableFooter } from '../../../components/Table/TableFooter';
import { TableHeader } from '../../../components/Table/TableHeader';
import { TableRowsSkeleton } from '../../../components/TableRowsSkeleton';
import { useTableHelper } from '../../../hooks/useTableHelper';
import { TransactionResponse } from '../../../types/transaction';
import { getCashflowColumns } from './CashflowColumns';

type RowActions = Parameters<typeof getCashflowColumns>[0];

interface Props extends RowActions {
  data?: TransactionResponse;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
}

export function CashflowTable({
  data,
  isFetching,
  isError,
  refetch,
  selectedRows,
  onSelectionChange,
  onEdit,
  onViewSaleInfo,
  onDelete,
}: Props) {
  const columns = useMemo(() => getCashflowColumns({ onEdit, onDelete, onViewSaleInfo }), []);

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
