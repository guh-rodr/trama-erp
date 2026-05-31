import { RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { DataTable } from '../../../components/DataTable';
import { StockMovementResponse } from '../../../types/stock-movement';
import { getStockMovementsColumns } from './StockMovementsColumns';

interface Props {
  data?: StockMovementResponse;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
  canShowBalanceCol: boolean;
}

export function StockMovementsTable({
  data,
  isFetching,
  isError,
  refetch,
  selectedRows,
  onSelectionChange,
  canShowBalanceCol,
}: Props) {
  const columns = useMemo(() => getStockMovementsColumns(canShowBalanceCol), [canShowBalanceCol]);

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
