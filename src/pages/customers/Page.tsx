import { PlusIcon } from '@phosphor-icons/react';
import { Button } from '../../components/Button';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Filter } from '../../components/Filter/Filter';
import { PageActions } from '../../components/PageActions/PageActions';
import { SearchBar } from '../../components/SearchBar';
import { useDialog } from '../../contexts/dialog/dialog-context';
import { useFilter } from '../../hooks/useFilter';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useRowSelection } from '../../hooks/useRowSelection';
import { CustomerForm, CustomerRow } from '../../types/customer';
import { FilterFieldProps } from '../../types/filters';
import { SaleFormDrawer } from '../sales/components/SaleForm/SaleForm';
import { CustomerDeleteModal } from './components/CustomerDeleteModal';
import { CustomerFormModal } from './components/CustomerFormModal';
import { CustomerInfoDrawer } from './components/CustomerInfoDrawer';
import { CustomersTable } from './components/CustomersTable';

const filterFields: FilterFieldProps[] = [
  {
    key: 'name',
    label: 'Nome',
    type: 'text',
  },
  {
    key: 'phone',
    label: 'Telefone',
    type: 'text',
  },
  {
    key: 'totalSpent',
    label: 'Total gasto',
    type: 'currency',
  },
  {
    key: 'debt',
    label: 'Dívida',
    type: 'currency',
  },
  {
    key: 'lastPurchaseAt',
    label: 'Última compra',
    type: 'date',
  },
];

export function CustomersPage() {
  usePageTitle('Clientes');

  const { selectedRows, selectedRowsId, clearSelectedRows, setSelectedRows } = useRowSelection();
  const { openDialog } = useDialog();

  const filter = useFilter();

  const onEdit = (data: CustomerRow) => {
    const defaultValues: CustomerForm = {
      id: data.id,
      name: data.name,
      phone: data.phone,
      note: data.note,
    };

    openDialog({
      title: 'Editar informações do cliente',
      type: 'modal',
      content: <CustomerFormModal creationQueryType="list" defaultValues={defaultValues} />,
    });
  };

  const onViewInfo = (rowId: string) => {
    openDialog({
      title: 'Informações do cliente',
      type: 'drawer',
      content: <CustomerInfoDrawer id={rowId} />,
    });
  };

  const onCreateSale = (data: CustomerRow) => {
    openDialog({
      title: 'Adicionar uma nova venda',
      type: 'drawer',
      content: <SaleFormDrawer defaultCustomer={data} />,
    });
  };

  const onDelete = (rowId: string, rowName: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <CustomerDeleteModal customers={[{ id: rowId, name: rowName }]} />,
    });
  };

  const openCustomerForm = () => {
    openDialog({
      title: 'Adicionar um novo cliente',
      type: 'modal',
      content: <CustomerFormModal creationQueryType="list" onCreate={() => filter.resetFilter()} />,
    });
  };

  const onDeleteSelectedRows = () => {
    const ids = selectedRowsId.map((rowId) => ({ id: rowId }));

    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <CustomerDeleteModal onDelete={clearSelectedRows} customers={ids} />,
    });
  };

  return (
    <DashboardLayout title="Clientes">
      <PageActions>
        <PageActions.Section>
          <SearchBar placeholder="Buscar por nome ou telefone..." onSearch={filter.resetFilter} />

          <Filter {...filter} fields={filterFields} onApplyFilter={clearSelectedRows} />

          <PageActions.DeleteButton canShow={selectedRowsId.length > 0} onClick={onDeleteSelectedRows} />
        </PageActions.Section>

        <PageActions.Section>
          <Button onClick={openCustomerForm}>
            <PlusIcon size={14} weight="bold" />
            Novo cliente
          </Button>
        </PageActions.Section>
      </PageActions>

      <CustomersTable
        filter={filter.appliedFilter}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onEdit={onEdit}
        onViewInfo={onViewInfo}
        onCreateSale={onCreateSale}
        onDelete={onDelete}
      />
    </DashboardLayout>
  );
}
