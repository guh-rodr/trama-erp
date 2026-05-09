import { RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { DataTable } from '../../../components/DataTable';
import { FilterForm } from '../../../components/Filter/Filter';
import { useFetchTableProducts } from '../../../hooks/useProducts';
import { getProductsColumns } from './ProductsColumns';

type RowActions = Parameters<typeof getProductsColumns>[0];

interface Props extends RowActions {
  filter: FilterForm;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
}

export function ProductsTable({ filter, selectedRows, onSelectionChange, onEdit, onDelete }: Props) {
  const { data, isFetching, isError, refetch } = useFetchTableProducts(filter);
  const columns = useMemo(() => getProductsColumns({ onEdit, onDelete }), []);

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
