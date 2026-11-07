import { PlusIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { Button } from '../../components/Button';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Filter } from '../../components/Filter/Filter';
import { PageActions } from '../../components/PageActions/PageActions';
import { SearchBar } from '../../components/SearchBar';
import { useDialog } from '../../contexts/dialog/dialog-context';
import { FilterForm, useFilter } from '../../hooks/useFilter';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  useCancelReceivable,
  useDeleteReceivable,
  useReceivables,
  useUncancelReceivable,
} from '../../hooks/useReceivables';
import { useRowSelection } from '../../hooks/useRowSelection';
import { FilterFieldProps } from '../../types/filters';
import { ReceivableForm } from '../../types/receivables';
import { ReceivableFormDrawer } from './components/ReceivableFormDrawer';
import { ReceivablePaymentFormModal } from './components/ReceivablePaymentFormModal';
import { ReceivableReverseModal } from './components/ReceivableReverseModal';
import { StockMovementsTable } from './components/ReceivablesTable';

const filterFields: FilterFieldProps[] = [
  {
    key: 'status',
    label: 'Status',
    type: 'enum',
    options: [
      { label: 'Pendente', value: 'PENDING' },
      { label: 'Parciais', value: 'PARTIAL' },
      { label: 'Pagas', value: 'PAID' },
      { label: 'Canceladas', value: 'CANCELLED' },
    ],
  },
  {
    key: 'description',
    label: 'Descrição',
    type: 'text',
  },
  {
    key: 'total',
    label: 'Total',
    type: 'currency',
  },
  {
    key: 'paid',
    label: 'Pago',
    type: 'currency',
  },
  {
    key: 'dueAt',
    label: 'Vencimento',
    type: 'date',
  },
];

export function ReceivablesPage() {
  usePageTitle('Contas a receber');

  const { data: receivables, isFetching, isError, refetch } = useReceivables();

  const { mutateAsync: cancelReceivable, isPending: isCancellingReceivable } = useCancelReceivable();
  const { mutateAsync: uncancelReceivable, isPending: isUncancellingReceivable } = useUncancelReceivable();
  const { mutateAsync: deleteReceivable, isPending: isDeletingReceivable } = useDeleteReceivable();

  const { selectedRows, setSelectedRows, clearSelectedRows } = useRowSelection();
  const { openDialog } = useDialog();

  const { filter, setFilter, resetFilter } = useFilter();

  const handleApplyFilter = (filter: FilterForm) => {
    setFilter(filter);
    clearSelectedRows();
  };

  const selectedFilter = useMemo(() => filter.filters.find((f) => f.field === 'status')?.value ?? 'ALL', [filter]);

  const openReceivableForm = () => {
    openDialog({
      title: 'Adicionar uma nova conta',
      type: 'drawer',
      content: <ReceivableFormDrawer onCreate={resetFilter} />,
    });
  };

  const onCreatePayment = (rowId: string, customerId: string, sum: number) => {
    openDialog({
      title: 'Realizar pagamento',
      type: 'modal',
      content: <ReceivablePaymentFormModal customerId={customerId} receivableId={rowId} sum={sum} />,
    });
  };

  const onReverse = (rowId: string) => {
    openDialog({
      title: 'Estornar conta',
      type: 'modal',
      content: <ReceivableReverseModal receivableId={rowId} />,
    });
  };

  const onEdit = (data: ReceivableForm) => {
    openDialog({
      title: 'Editar conta',
      type: 'drawer',
      content: <ReceivableFormDrawer defaultValues={data} />,
    });
  };

  const onCancel = (rowId: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: (
        <ConfirmationModal
          description="Tem certeza que deseja cancelar essa conta?"
          isLoading={isCancellingReceivable}
          onConfirm={() => cancelReceivable({ id: rowId })}
        />
      ),
    });
  };

  const onUncancel = (rowId: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: (
        <ConfirmationModal
          description="Tem certeza que deseja reativar essa conta?"
          isLoading={isUncancellingReceivable}
          onConfirm={() => uncancelReceivable({ id: rowId })}
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
          description="Tem certeza que deseja excluir essa conta? Essa ação é irreversível."
          isLoading={isDeletingReceivable}
          onConfirm={() => deleteReceivable({ id: rowId })}
        />
      ),
    });
  };

  const handleFilterByStatus = (status: string | null) => {
    if (!status) {
      setFilter({ filters: [], logical: 'AND' });
      return;
    }

    setFilter({ filters: [{ field: 'status', operator: 'equals', value: status }], logical: 'AND' });
  };

  return (
    <DashboardLayout title="Contas a receber">
      <PageActions>
        <PageActions.Section>
          <SearchBar placeholder="Buscar por descrição..." />

          <div className="shadow-xs rounded-lg border border-neutral-200 bg-white text-neutral-500 text-sm p-1 flex items-center *:px-2 *:transition-colors *:data-[selected=true]:bg-emerald-200/30 *:data-[selected=true]:text-emerald-500 *:data-[selected=false]:hover:text-black">
            <button
              type="button"
              className="h-full rounded-md"
              data-selected={selectedFilter === 'ALL'}
              onClick={() => handleFilterByStatus(null)}
            >
              Todos
            </button>

            <button
              type="button"
              className="h-full rounded-md"
              data-selected={selectedFilter === 'PENDING'}
              onClick={() => handleFilterByStatus('PENDING')}
            >
              Pendentes
            </button>
            <button
              type="button"
              className="h-full rounded-md"
              data-selected={selectedFilter === 'PARTIAL'}
              onClick={() => handleFilterByStatus('PARTIAL')}
            >
              Parciais
            </button>
            <button
              type="button"
              className="h-full rounded-md"
              data-selected={selectedFilter === 'PAID'}
              onClick={() => handleFilterByStatus('PAID')}
            >
              Pagos
            </button>
            <button
              type="button"
              className="h-full rounded-md"
              data-selected={selectedFilter === 'CANCELLED'}
              onClick={() => handleFilterByStatus('CANCELLED')}
            >
              Cancelados
            </button>
          </div>

          <Filter fields={filterFields} filter={filter} onApply={handleApplyFilter} />
        </PageActions.Section>

        <PageActions.Section>
          <Button onClick={openReceivableForm}>
            <PlusIcon size={14} weight="bold" />
            Nova conta
          </Button>
        </PageActions.Section>
      </PageActions>

      <StockMovementsTable
        data={receivables}
        isError={isError}
        isFetching={isFetching}
        refetch={refetch}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onCreatePayment={onCreatePayment}
        onReverse={onReverse}
        onEdit={onEdit}
        onCancel={onCancel}
        onUncancel={onUncancel}
        onDelete={onDelete}
      />
    </DashboardLayout>
  );
}
