import { DataTable } from '@/components/DataTable';
import type { ContactResponse } from '@/features/contacts/types/contacts.types';
import type { RowSelectionState } from '@tanstack/react-table';
import { useMemo, type Dispatch, type SetStateAction } from 'react';
import { getContactsColumns } from './ContactsColumns';

type RowActions = Parameters<typeof getContactsColumns>[0];

interface Props extends RowActions {
  data?: ContactResponse;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  selectedRows: RowSelectionState;
  onSelectionChange: Dispatch<SetStateAction<RowSelectionState>>;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ContactsTable({
  data,
  isFetching,
  isError,
  refetch,
  selectedRows,
  onSelectionChange,
  onEdit,
  onViewInfo,
  onArchive,
  onUnarchive,
  onDelete,
}: Props) {
  const columns = useMemo(() => getContactsColumns({ onEdit, onViewInfo, onArchive, onUnarchive, onDelete }), []);

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
