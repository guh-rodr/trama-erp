import { PlusIcon } from '@phosphor-icons/react';
import { Button } from '../../components/Button';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useDialog } from '../../contexts/dialog/dialog-context';
import { usePageTitle } from '../../hooks/usePageTitle';
import { CategoriesList } from './components/CategoriesList';
import { CategoryForm } from './components/CategoryForm';

export function ProductsPage() {
  usePageTitle('Produtos');

  const { openDialog } = useDialog();

  const openCategoryForm = () => {
    openDialog({
      title: 'Adicionar nova categoria',
      type: 'modal',
      content: <CategoryForm />,
    });
  };

  return (
    <DashboardLayout title="Produtos">
      <div className="flex justify-end">
        <Button type="button" onClick={openCategoryForm}>
          <PlusIcon weight="bold" size={15} />
          Novo produto
        </Button>
      </div>
      <CategoriesList />
    </DashboardLayout>
  );
}
