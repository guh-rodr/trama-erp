import { PlusIcon } from '@phosphor-icons/react';
import { format, parseISO } from 'date-fns';
import { Button } from '../../components/Button';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Filter } from '../../components/Filter/Filter';
import { PageActions } from '../../components/PageActions/PageActions';
import { SearchBar } from '../../components/SearchBar';
import { useDialog } from '../../contexts/dialog/dialog-context';
import { convertToDecimal } from '../../functions/currency';
import { useFilter } from '../../hooks/useFilter';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useRowSelection } from '../../hooks/useRowSelection';
import { FilterFieldProps, FilterForm } from '../../types/filters';
import { TransactionRow } from '../../types/transaction';
import { TRANSACTION_CATEGORIES } from '../../utils/transactionCategories';
import { SaleInfoDrawer } from '../sales/components/SaleInfoDrawer';
import { CashflowTable } from './components/CashflowTable';
import { TransactionDeleteModal } from './components/TransactionDeleteModal';
import { TransactionForm } from './components/TransactionForm';

const INFLOW_CATEGORIES = TRANSACTION_CATEGORIES['inflow'].map((cat) => ({
  ...cat,
  group: 'Entradas',
}));

const OUTFLOW_CATEGORIES = TRANSACTION_CATEGORIES['outflow'].map((cat) => ({
  ...cat,
  group: 'Saídas',
}));

const filterFields: FilterFieldProps[] = [
  {
    key: 'description',
    label: 'Descrição',
    type: 'text',
  },
  {
    key: 'value',
    label: 'Valor',
    type: 'currency',
  },
  {
    key: 'flow',
    label: 'Fluxo',
    type: 'enum',
    options: [
      { label: 'Entrada', value: 'inflow' },
      { label: 'Saída', value: 'outflow' },
    ],
  },
  {
    key: 'category',
    label: 'Categoria',
    type: 'enum',
    options: [...INFLOW_CATEGORIES, ...OUTFLOW_CATEGORIES],
  },
];

export function CashflowPage() {
  usePageTitle('Fluxo de Caixa');

  const { selectedRows, selectedRowsId, clearSelectedRows, setSelectedRows } = useRowSelection();
  const { openDialog } = useDialog();

  const { filter, setFilter, resetFilter } = useFilter();

  const handleApplyFilter = (filter: FilterForm) => {
    setFilter(filter);
    clearSelectedRows();
  };

  const openTransactionForm = () => {
    openDialog({
      title: 'Adicionar nova transação',
      type: 'modal',
      content: <TransactionForm onCreate={resetFilter} />,
    });
  };

  const onDeleteSelectedRows = () => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <TransactionDeleteModal ids={selectedRowsId} onDelete={clearSelectedRows} />,
    });
  };

  const onEdit = (data: TransactionRow) => {
    const defaultValues: TransactionRow = {
      ...data,
      value: convertToDecimal(data.value),
      date: format(parseISO(data.date), 'yyyy-MM-dd'),
    };

    openDialog({
      title: 'Editar informações da transação',
      type: 'modal',
      content: <TransactionForm defaultValues={defaultValues} />,
    });
  };

  const onDelete = (id: string, isSale: boolean) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <TransactionDeleteModal ids={[id]} isSale={isSale} />,
    });
  };

  const onViewSaleInfo = (saleId: string) => {
    openDialog({
      title: 'Informações da venda',
      type: 'drawer',
      content: <SaleInfoDrawer id={saleId} />,
    });
  };

  return (
    <DashboardLayout title="Fluxo de Caixa">
      <PageActions>
        <PageActions.Section>
          <SearchBar placeholder="Buscar por descrição..." onSearch={resetFilter} />

          <Filter filter={filter} fields={filterFields} onApply={handleApplyFilter} />

          <PageActions.DeleteButton canShow={selectedRowsId.length > 0} onClick={onDeleteSelectedRows} />
        </PageActions.Section>

        <PageActions.Section>
          <Button onClick={openTransactionForm}>
            <PlusIcon size={14} weight="bold" />
            Nova transação
          </Button>
        </PageActions.Section>
      </PageActions>

      <CashflowTable
        filter={filter}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onEdit={onEdit}
        onViewSaleInfo={onViewSaleInfo}
        onDelete={onDelete}
      />
    </DashboardLayout>
  );
}
