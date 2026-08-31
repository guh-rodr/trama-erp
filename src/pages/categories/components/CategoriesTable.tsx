import { RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { DataTable } from '../../../components/DataTable';
import { CategoryResponse } from '../../../types/category';
import { getCategoriesColumns } from './CategoriesColumns';

type RowActions = Parameters<typeof getCategoriesColumns>[0];

interface Props extends RowActions {
  data?: CategoryResponse;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
}

export function CategoriesTable({
  data,
  isFetching,
  isError,
  refetch,
  selectedRows,
  onSelectionChange,
  onEdit,
  onDelete,
}: Props) {
  const columns = useMemo(() => getCategoriesColumns({ onEdit, onDelete }), []);

  return (
    <DataTable
      columns={columns}
      data={data?.rows ?? []}
      pageCount={data?.pageCount || 0}
      rowCount={data?.rowCount || 0}
      isFetching={isFetching}
      isError={isError}
      refetch={refetch}
      selectedRows={selectedRows}
      onSelectionChange={onSelectionChange}
      getRowId={(row) => row.id}
    />
  );
}
