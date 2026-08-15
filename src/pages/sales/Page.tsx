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
import { useSales } from '../../hooks/useSales';
import { CustomerRow } from '../../types/customer';
import { FilterFieldProps, FilterForm } from '../../types/filters';
import { CustomerInfoDrawer } from '../customers/components/CustomerInfoDrawer';
import { SaleDeleteModal } from './components/SaleDeleteModal';
import { SaleFormDrawer } from './components/SaleForm/SaleForm';
import { SaleInfoDrawer } from './components/SaleInfoDrawer';
import { SalesTable } from './components/SalesTable';

const filterFields: FilterFieldProps[] = [
  {
    key: 'customerName',
    label: 'Nome do cliente',
    type: 'text',
  },
  {
    key: 'status',
    label: 'Status',
    type: 'enum',
    options: [
      { label: 'Pago', value: 'paid' },
      { label: 'Pendente', value: 'pending' },
    ],
  },
  {
    key: 'total',
    label: 'Valor total',
    type: 'currency',
  },
  {
    key: 'profit',
    label: 'Lucro total',
    type: 'currency',
  },
  {
    key: 'itemCount',
    label: 'Qntd. itens',
    type: 'number',
  },
  {
    key: 'purchasedAt',
    label: 'Data de compra',
    type: 'date',
  },
];

export function SalesPage() {
  usePageTitle('Vendas');

  const { data: sales, isFetching, isError, refetch } = useSales();

  const { selectedRows, selectedRowsId, clearSelectedRows, setSelectedRows } = useRowSelection();
  const { openDialog } = useDialog();

  const { filter, setFilter, resetFilter } = useFilter();

  const handleApplyFilter = (filter: FilterForm) => {
    setFilter(filter);
    clearSelectedRows();
  };

  const openSaleForm = () => {
    openDialog({
      title: 'Adicionar uma nova venda',
      type: 'drawer',
      width: '35vw',
      content: <SaleFormDrawer onCreate={resetFilter} />,
    });
  };

  const onViewInfo = (rowId: string) => {
    openDialog({
      title: 'Informações da venda',
      type: 'drawer',
      content: <SaleInfoDrawer id={rowId} />,
    });
  };

  const onViewCustomerInfo = (customerId: CustomerRow['id']) => {
    openDialog({
      title: 'Informações do cliente',
      type: 'drawer',
      content: <CustomerInfoDrawer id={customerId} />,
    });
  };

  const onDelete = (rowId: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <SaleDeleteModal ids={[rowId]} />,
    });
  };

  const onDeleteSelectedRows = () => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <SaleDeleteModal onDelete={clearSelectedRows} ids={selectedRowsId} />,
    });
  };

  return (
    <DashboardLayout title="Vendas">
      <PageActions>
        <PageActions.Section>
          <SearchBar placeholder="Buscar por nome ou telefone do cliente..." onSearch={resetFilter} />

          <Filter filter={filter} fields={filterFields} onApply={handleApplyFilter} />

          <PageActions.DeleteButton canShow={selectedRowsId.length > 0} onClick={onDeleteSelectedRows} />
        </PageActions.Section>

        <PageActions.Section>
          <Button onClick={openSaleForm}>
            <PlusIcon size={14} weight="bold" />
            Nova venda
          </Button>
        </PageActions.Section>
      </PageActions>

      <SalesTable
        data={sales}
        isError={isError}
        isFetching={isFetching}
        refetch={refetch}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onViewInfo={onViewInfo}
        onViewCustomerInfo={onViewCustomerInfo}
        onDelete={onDelete}
      />
    </DashboardLayout>
  );
}
