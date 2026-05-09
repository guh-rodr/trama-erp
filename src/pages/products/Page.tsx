import { PlusIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { Button } from '../../components/Button';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Filter } from '../../components/Filter/Filter';
import { PageActions } from '../../components/PageActions/PageActions';
import { SearchBar } from '../../components/SearchBar';
import { useDialog } from '../../contexts/dialog/dialog-context';
import { useCategoriesAutocomplete } from '../../hooks/useCategories';
import { useFilter } from '../../hooks/useFilter';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useRowSelection } from '../../hooks/useRowSelection';
import { CategoryItem } from '../../types/category';
import { FilterFieldProps } from '../../types/filters';
import { ProductDeleteModal } from './components/ProductDeleteModal';
import { ProductFormDrawer } from './components/ProductFormDrawer';
import { ProductsTable } from './components/ProductsTable';

export function ProductsPage() {
  usePageTitle('Produtos');

  const { data: categories } = useCategoriesAutocomplete({ fetchOnMount: true, canFetchModels: false });

  const filterFields: FilterFieldProps[] = useMemo(
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

  const { selectedRows, selectedRowsId, clearSelectedRows, setSelectedRows } = useRowSelection();
  const { openDialog } = useDialog();

  const filter = useFilter();

  const openProductForm = () => {
    openDialog({
      title: 'Adicionar novo produto',
      type: 'drawer',
      content: <ProductFormDrawer />,
    });
  };

  const onDeleteSelectedRows = () => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <ProductDeleteModal onDelete={clearSelectedRows} ids={selectedRowsId} />,
    });
  };

  const onEdit = (rowId: string, category: Pick<CategoryItem, 'id' | 'name'>) => {
    openDialog({
      title: 'Editar informações do produto',
      type: 'drawer',
      content: <ProductFormDrawer defaultProductId={rowId} defaultCategory={category} />,
    });
  };

  const onDelete = (rowId: string) => {
    openDialog({
      title: 'Confirmação',
      type: 'modal',
      content: <ProductDeleteModal ids={[rowId]} />,
    });
  };

  return (
    <DashboardLayout title="Produtos">
      <PageActions>
        <PageActions.Section>
          <SearchBar placeholder="Buscar por nome" onSearch={filter.resetFilter} />

          <Filter {...filter} fields={filterFields} onApplyFilter={clearSelectedRows} />

          <PageActions.DeleteButton canShow={selectedRowsId.length > 0} onClick={onDeleteSelectedRows} />
        </PageActions.Section>

        <PageActions.Section>
          <Button onClick={openProductForm}>
            <PlusIcon size={14} weight="bold" />
            Novo produto
          </Button>
        </PageActions.Section>
      </PageActions>

      <ProductsTable
        filter={filter.appliedFilter}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </DashboardLayout>
  );
}
