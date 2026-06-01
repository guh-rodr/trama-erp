import { PlusIcon } from '@phosphor-icons/react';
import { Button } from '../../components/Button';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Filter } from '../../components/Filter/Filter';
import { PageActions } from '../../components/PageActions/PageActions';
import { SearchBar } from '../../components/SearchBar';
import { useDialog } from '../../contexts/dialog/dialog-context';
import { useCustomers } from '../../hooks/useCustomers';
import { useFilter } from '../../hooks/useFilter';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useRowSelection } from '../../hooks/useRowSelection';
import { CustomerForm, CustomerRow } from '../../types/customer';
import { FilterFieldProps, FilterForm } from '../../types/filters';
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

  const { data: customers, isFetching, isError, refetch } = useCustomers();

  const { selectedRows, selectedRowsId, clearSelectedRows, setSelectedRows } = useRowSelection();
  const { openDialog } = useDialog();

  const { filter, setFilter, resetFilter } = useFilter();

  const handleApplyFilter = (filter: FilterForm) => {
    setFilter(filter);
    clearSelectedRows();
  };

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
      content: <CustomerFormModal defaultValues={defaultValues} />,
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

  const onDelete = (rowId: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <CustomerDeleteModal ids={[rowId]} />,
    });
  };

  const openCustomerForm = () => {
    openDialog({
      title: 'Adicionar um novo cliente',
      type: 'modal',
      content: <CustomerFormModal onCreate={resetFilter} />,
    });
  };

  const onDeleteSelectedRows = () => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <CustomerDeleteModal onDelete={clearSelectedRows} ids={selectedRowsId} />,
    });
  };

  return (
    <DashboardLayout title="Clientes">
      <PageActions>
        <PageActions.Section>
          <SearchBar placeholder="Buscar por nome ou telefone..." onSearch={resetFilter} />

          <Filter filter={filter} fields={filterFields} onApply={handleApplyFilter} />

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
        data={customers}
        isError={isError}
        isFetching={isFetching}
        refetch={refetch}
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
