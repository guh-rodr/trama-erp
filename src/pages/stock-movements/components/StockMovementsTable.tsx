import { RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { DataTable } from '../../../components/DataTable';
import { useFetchTableStockMovements } from '../../../hooks/useStockMovement';
import { FilterForm } from '../../../types/filters';
import { getStockMovementsColumns } from './StockMovementsColumns';

interface Props {
  filter: FilterForm;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
  canShowBalanceCol: boolean;
}

export function StockMovementsTable({ filter, selectedRows, onSelectionChange, canShowBalanceCol }: Props) {
  const { data, isFetching, isError, refetch } = useFetchTableStockMovements(filter);
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
