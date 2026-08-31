import { PlusIcon } from '@phosphor-icons/react';
import { Button } from '../../components/Button';
import { ConfirmationModal } from '../../components/ConfirmationModal';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Filter } from '../../components/Filter/Filter';
import { PageActions } from '../../components/PageActions/PageActions';
import { SearchBar } from '../../components/SearchBar';
import { useDialog } from '../../contexts/dialog/dialog-context';
import { useCategories, useDeleteCategory } from '../../hooks/useCategories';
import { FilterForm, useFilter } from '../../hooks/useFilter';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useRowSelection } from '../../hooks/useRowSelection';
import { CategoryForm, CategoryRow } from '../../types/category';
import { FilterFieldProps } from '../../types/filters';
import { CategoriesTable } from './components/CategoriesTable';
import { CategoryFormModal } from './components/CategoryFormModal';

const filterFields: FilterFieldProps[] = [
  {
    key: 'name',
    label: 'Nome',
    type: 'text',
  },
];

export function CategoriesPage() {
  usePageTitle('Categorias');

  const { data: categories, isFetching, isError, refetch } = useCategories();

  const { mutateAsync: deleteCategory, isPending: isDeletingCategory } = useDeleteCategory();

  const { selectedRows, clearSelectedRows, setSelectedRows } = useRowSelection();
  const { openDialog } = useDialog();

  const { filter, setFilter, resetFilter } = useFilter();

  const handleApplyFilter = (filter: FilterForm) => {
    setFilter(filter);
    clearSelectedRows();
  };

  const openCategoryForm = () => {
    openDialog({
      title: 'Adicionar uma nova categoria',
      type: 'modal',
      content: <CategoryFormModal />,
    });
  };

  const onEdit = (data: CategoryForm) => {
    openDialog({
      title: 'Editar informações da categoria',
      type: 'modal',
      content: <CategoryFormModal defaultValues={data} />,
    });
  };

  const onDelete = (row: CategoryRow) => {
    const desc =
      (row.productCount > 0 ? `Essa categoria possui ${row.productCount} produto(s) vinculado(s). ` : '') +
      'Deseja realmente exclui-la? Essa ação é irreversível';

    openDialog({
      title: 'Confirmar',
      type: 'modal',
      content: (
        <ConfirmationModal
          description={desc}
          onConfirm={() => deleteCategory({ id: row.id })}
          isLoading={isDeletingCategory}
        />
      ),
    });
  };

  return (
    <DashboardLayout title="Categorias">
      <PageActions>
        <PageActions.Section>
          <SearchBar placeholder="Buscar por nome..." onSearch={resetFilter} />

          <Filter filter={filter} fields={filterFields} onApply={handleApplyFilter} />
        </PageActions.Section>

        <PageActions.Section>
          <Button onClick={openCategoryForm}>
            <PlusIcon size={14} weight="bold" />
            Nova categoria
          </Button>
        </PageActions.Section>
      </PageActions>

      <CategoriesTable
        data={categories}
        isError={isError}
        isFetching={isFetching}
        refetch={refetch}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </DashboardLayout>
  );
}
