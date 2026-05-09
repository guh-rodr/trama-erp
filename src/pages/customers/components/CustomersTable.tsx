import { RowSelectionState } from '@tanstack/react-table';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { DataTable } from '../../../components/DataTable';
import { FilterForm } from '../../../components/Filter/Filter';
import { useFetchTableCustomers } from '../../../hooks/useCustomers';
import { getCustomersColumns } from './CustomersColumns';

type RowActions = Parameters<typeof getCustomersColumns>[0];

interface Props extends RowActions {
  filter: FilterForm;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
}

export function CustomersTable({
  selectedRows,
  onSelectionChange,
  filter,
  onEdit,
  onViewInfo,
  onCreateSale,
  onDelete,
}: Props) {
  const { data, isFetching, isError, refetch } = useFetchTableCustomers(filter);
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
