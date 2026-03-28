import { PlusIcon } from '@phosphor-icons/react';
import { Button } from '../../components/Button';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useDialog } from '../../contexts/dialog/dialog-context';
import { usePageTitle } from '../../hooks/usePageTitle';
import { CategoriesList } from './components/CategoriesList';
import { CategoryForm } from './components/CategoryForm';

export function CategoriesPage() {
  usePageTitle('Categorias e Modelos');

  const { openDialog } = useDialog();

  const openCategoryForm = () => {
    openDialog({
      title: 'Adicionar nova categoria',
      type: 'modal',
      content: <CategoryForm />,
    });
  };

  return (
    <DashboardLayout title="Categorias">
      <div className="flex justify-end">
        <Button type="button" onClick={openCategoryForm}>
          <PlusIcon weight="bold" size={15} />
          Nova categoria
        </Button>
      </div>
      <CategoriesList />
    </DashboardLayout>
  );
}
