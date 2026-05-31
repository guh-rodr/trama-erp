import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Filter } from '../../components/Filter/Filter';
import { PageActions } from '../../components/PageActions/PageActions';
import { SearchBar } from '../../components/SearchBar';
import { useCategoriesAutocomplete } from '../../hooks/useCategories';
import { useFilter } from '../../hooks/useFilter';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useRowSelection } from '../../hooks/useRowSelection';
import { useStockMovements } from '../../hooks/useStockMovement';
import { FilterFieldProps, FilterForm } from '../../types/filters';
import { StockMovementsTable } from './components/StockMovementsTable';

export function StockMovementsPage() {
  usePageTitle('Movimentações de Estoque');

  const { data: stockMovements, isFetching, isError, refetch } = useStockMovements();
  const { data: categories, isFetching: isFetchingCategories } = useCategoriesAutocomplete({
    fetchOnMount: true,
    canFetchModels: true,
  });
  const options = useMemo(
    () =>
      categories?.flatMap(({ name, products }) => products.map((p) => ({ label: p.name, value: p.id, group: name }))) ??
      [],
    [categories],
  );

  const [searchParams] = useSearchParams();
  const productId = searchParams.get('pid');

  const defaultFilter: FilterForm | undefined = useMemo(() => {
    if (!productId) return;

    return {
      filters: [{ field: 'productId', operator: 'equals', value: productId }],
      logical: 'AND',
    };
  }, [productId]);

  const filterFields: FilterFieldProps[] = useMemo(() => {
    return [
      { key: 'date', label: 'Data', type: 'date' },
      { key: 'productId', label: 'Produto', type: 'enum', options },
      { key: 'unitCost', label: 'Custo un.', type: 'currency' },
      {
        key: 'type',
        label: 'Tipo',
        type: 'enum',
        options: [
          { label: 'Entrada', value: 'ENTRY' },
          { label: 'Saída', value: 'EXIT' },
        ],
      },
      {
        key: 'origin',
        label: 'Origem',
        type: 'enum',
        options: [
          { label: 'Manual', value: 'MANUAL' },
          { label: 'Compra', value: 'PURCHASE' },
          { label: 'Venda', value: 'SALE' },
        ],
      },
    ];
  }, [options]);

  const { selectedRows, clearSelectedRows, setSelectedRows } = useRowSelection();
  const { filter, setFilter } = useFilter(defaultFilter);

  const handleApplyFilter = (filter: FilterForm) => {
    setFilter(filter);
    clearSelectedRows();
  };

  const canShowBalanceCol = useMemo(
    () => filter.filters.some((f) => f.field === 'productId' && f.operator === 'equals'),
    [filter],
  );

  return (
    <DashboardLayout title="Movimentações de Estoque">
      <PageActions>
        <PageActions.Section>
          <SearchBar placeholder="Buscar por motivo..." />

          <Filter filter={filter} fields={filterFields} isLoading={isFetchingCategories} onApply={handleApplyFilter} />
        </PageActions.Section>
      </PageActions>

      <StockMovementsTable
        data={stockMovements}
        isError={isError}
        isFetching={isFetching}
        refetch={refetch}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        canShowBalanceCol={canShowBalanceCol}
      />
    </DashboardLayout>
  );
}
