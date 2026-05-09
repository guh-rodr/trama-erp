import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction } from 'react';
import { useTableHelper } from '../hooks/useTableHelper';
import { TableBody } from './Table/TableBody';
import { TableFooter } from './Table/TableFooter';
import { TableHeader } from './Table/TableHeader';
import { TableRowsSkeleton } from './TableRowsSkeleton';

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pageCount: number;
  rowCount: number;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
  getRowId: (row: T) => string;
}

export function DataTable<T>({ columns, data, isFetching, ...rest }: DataTableProps<T>) {
  const table = useTableHelper({ columns, data, ...rest });

  return (
    <table className="min-w-full min-h-full divide-y divide-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <TableHeader table={table} />
      {isFetching ? (
        <tbody>
          <TableRowsSkeleton columnCount={columns.length - 1} />
        </tbody>
      ) : (
        <TableBody table={table} isError={rest.isError} columnsLength={columns.length} refetch={rest.refetch} />
      )}
      {!isFetching && <TableFooter table={table} />}
    </table>
  );
}
