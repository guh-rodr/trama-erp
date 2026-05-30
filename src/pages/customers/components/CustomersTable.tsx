import { RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { DataTable } from '../../../components/DataTable';
import { CustomerResponse } from '../../../types/customer';
import { getCustomersColumns } from './CustomersColumns';

type RowActions = Parameters<typeof getCustomersColumns>[0];

interface Props extends RowActions {
  data?: CustomerResponse;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
}

export function CustomersTable({
  data,
  isFetching,
  isError,
  refetch,
  selectedRows,
  onSelectionChange,
  onEdit,
  onViewInfo,
  onCreateSale,
  onDelete,
}: Props) {
  const columns = useMemo(() => getCustomersColumns({ onEdit, onViewInfo, onCreateSale, onDelete }), []);

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
