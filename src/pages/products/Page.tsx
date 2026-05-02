import { PlusIcon } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../../components/Button';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Filter } from '../../components/Filter/Filter';
import { PageActions } from '../../components/PageActions/PageActions';
import { SearchBar } from '../../components/SearchBar';
import { useDialog } from '../../contexts/dialog/dialog-context';
import { useCategoriesAutocomplete } from '../../hooks/useCategories';
import { useFilter } from '../../hooks/useFilter';
import { usePageTitle } from '../../hooks/usePageTitle';
import { FilterFieldProps } from '../../types/filters';
import { ProductFormDrawer } from './components/ProductFormDrawer';
import { ProductsTable } from './components/ProductsTable';

export function ProductsPage() {
  usePageTitle('Produtos');

  const { data: categories } = useCategoriesAutocomplete({ fetchOnMount: true, canFetchModels: false });

  const PRODUCTS_FILTER_FIELDS: FilterFieldProps[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Nome',
        type: 'text',
      },
      {
        key: 'categoryId',
        label: 'Categoria',
        type: 'enum',
        options: categories?.map(({ id, name }) => ({ label: name, value: id })) ?? [],
      },
      {
        key: 'quantity',
        label: 'Estoque total',
        type: 'number',
      },
    ],
    [categories],
  );

  const [selectedRows, setSelectedRows] = useState({});

  const { openDialog } = useDialog();

  const filter = useFilter();
  const { appliedFilter, applyFilter } = filter;

  const openProductForm = () => {
    openDialog({
      title: 'Adicionar novo produto',
      type: 'drawer',
      content: <ProductFormDrawer />,
    });
  };

  const clearSelectedRows = () => {
    setSelectedRows({});
  };

  const handleSearch = () => {
    if (appliedFilter.filters.length) {
      applyFilter({ filters: [], logical: 'AND' });

      toast('Os filtros aplicados foram removidos', { position: 'top-right' });
    }
  };

  return (
    <DashboardLayout title="Produtos">
      <PageActions>
        <PageActions.Section>
          <SearchBar placeholder="Buscar por nome" onSearch={handleSearch} />

          <Filter {...filter} fields={PRODUCTS_FILTER_FIELDS} onApplyFilter={clearSelectedRows} />
        </PageActions.Section>

        <PageActions.Section>
          <Button onClick={openProductForm}>
            <PlusIcon size={14} weight="bold" />
            Novo produto
          </Button>
        </PageActions.Section>
      </PageActions>

      <ProductsTable filter={appliedFilter} selectedRows={selectedRows} onSelectionChange={setSelectedRows} />
    </DashboardLayout>
  );
}
