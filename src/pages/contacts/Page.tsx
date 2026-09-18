import { PlusIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { Button } from '../../components/Button';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Filter } from '../../components/Filter/Filter';
import { PageActions } from '../../components/PageActions/PageActions';
import { SearchBar } from '../../components/SearchBar';
import { useDialog } from '../../contexts/dialog/dialog-context';
import { useArchiveContact, useContacts, useDeleteContact, useUnarchiveContact } from '../../hooks/useContacts';
import { FilterForm, useFilter } from '../../hooks/useFilter';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useRowSelection } from '../../hooks/useRowSelection';
import { ContactType } from '../../types/contact';
import { FilterFieldProps } from '../../types/filters';
import { ContactFormModal } from './components/ContactFormModal';
import { ContactsTable } from './components/ContactsTable';

const filterFields: FilterFieldProps[] = [
  {
    key: 'name',
    label: 'Nome',
    type: 'text',
  },
  {
    key: 'type',
    label: 'Tipo',
    type: 'enum',
    options: [
      { label: 'Cliente', value: 'CUSTOMER' },
      { label: 'Fornecedor', value: 'SUPPLIER' },
    ],
  },
  {
    key: 'note',
    label: 'Nota',
    type: 'text',
  },
];

export function ContactsPage() {
  usePageTitle('Contatos');

  const { data: contacts, isFetching, isError, refetch } = useContacts();

  const { mutateAsync: archiveContact, isPending: isArchiving } = useArchiveContact();
  const { mutateAsync: unarchiveContact, isPending: isUnarchiving } = useUnarchiveContact();
  const { mutateAsync: deleteContact, isPending: isDeleting } = useDeleteContact();

  const { selectedRows, setSelectedRows, clearSelectedRows } = useRowSelection();
  const { openDialog } = useDialog();

  const { filter, setFilter } = useFilter();

  const handleApplyFilter = (filter: FilterForm) => {
    setFilter(filter);
    clearSelectedRows();
  };

  const handleFilterByType = (type: ContactType | null) => {
    if (!type) {
      setFilter({ filters: [], logical: 'AND' });
      return;
    }

    setFilter({ filters: [{ field: 'type', operator: 'equals', value: type }], logical: 'AND' });
  };

  const selectedFilter = useMemo(() => filter.filters.find((f) => f.field === 'type')?.value ?? 'ALL', [filter]);

  const openContactForm = () => {
    openDialog({
      title: 'Adicionar um novo contato',
      type: 'drawer',
      content: <ContactFormModal />,
    });
  };

  const onEdit = (rowId: string) => {
    openDialog({
      title: 'Editar informações do contato',
      type: 'drawer',
      content: <ContactFormModal defaultContactId={rowId} />,
    });
  };

  const onArchive = (rowId: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: (
        <ConfirmationModal
          description="Tem certeza que deseja arquivar esse contato?"
          isLoading={isArchiving}
          onConfirm={() => archiveContact({ id: rowId })}
        />
      ),
    });
  };

  const onUnarchive = (rowId: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: (
        <ConfirmationModal
          description="Tem certeza que deseja desarquivar esse contato?"
          isLoading={isUnarchiving}
          onConfirm={() => unarchiveContact({ id: rowId })}
        />
      ),
    });
  };

  const onDelete = (rowId: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: (
        <ConfirmationModal
          description="Tem certeza que deseja excluir esse contato? Essa ação é irreversível."
          isLoading={isDeleting}
          onConfirm={() => deleteContact({ id: rowId })}
        />
      ),
    });
  };

  const onViewInfo = (rowId: string) => {};

  return (
    <DashboardLayout title="Contatos">
      <PageActions>
        <PageActions.Section>
          <SearchBar placeholder="Buscar por nome..." />

          <div className="shadow-xs rounded-lg border border-neutral-200 bg-white text-neutral-500 text-sm p-1 flex items-center *:px-2 *:transition-colors *:data-[selected=true]:bg-emerald-200/20 *:data-[selected=true]:text-emerald-500 *:data-[selected=false]:hover:text-black">
            <button
              type="button"
              className="h-full rounded-md"
              data-selected={selectedFilter === 'ALL'}
              onClick={() => handleFilterByType(null)}
            >
              Todos
            </button>

            <button
              type="button"
              className="h-full rounded-md"
              data-selected={selectedFilter === 'CUSTOMER'}
              onClick={() => handleFilterByType('CUSTOMER')}
            >
              Clientes
            </button>
            <button
              type="button"
              className="h-full rounded-md"
              data-selected={selectedFilter === 'SUPPLIER'}
              onClick={() => handleFilterByType('SUPPLIER')}
            >
              Fornecedores
            </button>
          </div>

          <Filter fields={filterFields} filter={filter} onApply={handleApplyFilter} />
        </PageActions.Section>

        <PageActions.Section>
          <Button onClick={openContactForm}>
            <PlusIcon size={14} weight="bold" />
            Novo contato
          </Button>
        </PageActions.Section>
      </PageActions>

      <ContactsTable
        data={contacts}
        isError={isError}
        isFetching={isFetching}
        refetch={refetch}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onEdit={onEdit}
        onViewInfo={onViewInfo}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
        onDelete={onDelete}
      />
    </DashboardLayout>
  );
}
