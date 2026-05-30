import { RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { DataTable } from '../../../components/DataTable';
import { ProductResponse } from '../../../types/product';
import { getProductsColumns } from './ProductsColumns';

type RowActions = Parameters<typeof getProductsColumns>[0];

interface Props extends RowActions {
  data?: ProductResponse;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
}

export function ProductsTable({
  data,
  isFetching,
  isError,
  refetch,
  selectedRows,
  onSelectionChange,
  onCreateStockMovement,
  onViewInfo,
  onEdit,
  onDelete,
}: Props) {
  const columns = useMemo(() => getProductsColumns({ onCreateStockMovement, onViewInfo, onEdit, onDelete }), []);

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
