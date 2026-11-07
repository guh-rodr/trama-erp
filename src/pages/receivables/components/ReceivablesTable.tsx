import { RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { DataTable } from '../../../components/DataTable';
import { ReceivableResponse } from '../../../types/receivables';
import { getReceivablesColumns } from './ReceivablesColumns';

type RowActions = Parameters<typeof getReceivablesColumns>[0];

interface Props extends RowActions {
  data?: ReceivableResponse;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
}

export function StockMovementsTable({
  data,
  isFetching,
  isError,
  refetch,
  selectedRows,
  onSelectionChange,
  onCreatePayment,
  onReverse,
  onEdit,
  onCancel,
  onUncancel,
  onDelete,
}: Props) {
  const columns = useMemo(
    () => getReceivablesColumns({ onCreatePayment, onReverse, onEdit, onCancel, onUncancel, onDelete }),
    [],
  );

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
