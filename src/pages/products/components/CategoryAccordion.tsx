import { CaretRightIcon, CheckIcon, PencilLineIcon, PlusIcon, TrashIcon, XIcon } from '@phosphor-icons/react';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useEditCategory } from '../../../hooks/useCategories';
import { CategoryItem, EditCategoryForm } from '../../../types/category';
import { ProductItem } from '../../../types/product';
import { CategoryDeleteModal } from './CategoryDeleteModal';
import { ProductCard } from './ProductCard';
import { ProductDeleteModal } from './ProductDeleteModal';
import { ProductFormDrawer } from './ProductFormDrawer';

interface Props {
  category: CategoryItem;
  expandedCategoryId: string;
  editCategoryId: string;
  setEditCategoryId: Dispatch<SetStateAction<string>>;
  handleClickCategory: (id: string) => void;
}

export function CategoryAccordion({
  category,
  editCategoryId,
  setEditCategoryId,
  expandedCategoryId,
  handleClickCategory,
}: Props) {
  const { openDialog } = useDialog();
  const [products, setProducts] = useState<ProductItem[]>([]);

  const fetchedProducts = category.products!;

  useEffect(() => {
    const registeredProducts = fetchedProducts.map((m) => ({
      ...m,
      isTemp: false,
    }));

    setProducts(registeredProducts);
  }, [category.products, fetchedProducts]);

  const openDeleteCategory = (rowId: string, rowName: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <CategoryDeleteModal id={rowId} name={rowName} />,
    });
  };

  const handleAddProduct = () => {
    openDialog({
      type: 'drawer',
      title: 'Adicionar novo produto',
      content: <ProductFormDrawer defaultCategory={category} />,
    });
  };

  const { mutate } = useEditCategory();
  const { handleSubmit, register, reset } = useForm<EditCategoryForm>();

  const onError = useCallback(() => {
    toast.error('Existem campos vazios ou inválidos.', {
      id: 'form-error',
      position: 'top-right',
    });
  }, []);

  const onSubitCategoryEdit: SubmitHandler<EditCategoryForm> = (data) => {
    mutate(
      { ...data, id: category.id },
      {
        onSuccess: () => {
          setEditCategoryId('');
        },
      },
    );
  };

  const openProductDeleteModal = (productId: string, productName: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <ProductDeleteModal productId={productId} productName={productName} />,
    });
  };

  const handleEditProduct = (product: ProductItem) => {
    openDialog({
      type: 'drawer',
      title: 'Editar produto',
      content: <ProductFormDrawer defaultCategory={category} defaultProduct={product} />,
    });
  };

  return (
    <div key={category.id} className={`bg-white shadow rounded-2xl relative overflow-hidden group/container`}>
      <div className="p-4 hover:bg-neutral-50 cursor-pointer" onClick={() => handleClickCategory(category.id)}>
        {editCategoryId === category.id ? (
          <form onSubmit={handleSubmit(onSubitCategoryEdit, onError)}>
            <div className="relative flex w-[250px] space-x-1">
              <input
                className="field-sizing-content outline-none text-lg font-semibold pt-0.5 px-1 rounded-md bg-neutral-100/40 border border-neutral-300"
                {...register('name', {
                  required: 'O nome da categoria é obrigatório.',
                })}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                defaultValue={category.name}
              />

              <div className="flex items-center">
                <button
                  type="submit"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-emerald-500 size-fit p-2 block rounded-lg hover:bg-emerald-100/50 transition-colors m-0"
                >
                  <CheckIcon weight="bold" size={16} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditCategoryId('');
                    reset();
                  }}
                  className="text-red-500 size-fit p-2 block rounded-lg hover:bg-red-100/50 transition-colors m-0"
                >
                  <XIcon weight="bold" size={16} />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">{category.name}</span>
            <button
              type="button"
              className="text-neutral-500 size-fit p-2 block rounded-lg hover:text-blue-500 hover:bg-blue-100/50 transition-all m-0 opacity-0 group-hover/container:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                setEditCategoryId(category.id);
              }}
            >
              <PencilLineIcon weight="duotone" size={16} />
            </button>
          </div>
        )}

        <p className="text-sm text-neutral-500">
          {fetchedProducts.length || 'Nenhum'} {fetchedProducts.length > 1 ? 'produtos' : 'produto'}
        </p>

        <CaretRightIcon
          weight="bold"
          size={18}
          className={`text-neutral-500 absolute right-0 -mt-9 mr-4 transition-transform ${category.id === expandedCategoryId ? 'rotate-90' : ''}`}
        />
      </div>

      {category.id === expandedCategoryId && (
        <div className={`p-4 flex flex-col gap-4 border-t border-y-neutral-200`}>
          {!!products.length && (
            <div className="flex flex-wrap gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  itemsCount={product.itemCount}
                  onEdit={() => handleEditProduct(product)}
                  onDelete={() => openProductDeleteModal(product.id, product.name)}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={handleAddProduct}
              className="flex items-center gap-1 text-emerald-500 enabled:hover:bg-emerald-100/50 p-1 rounded-md transition-all disabled:opacity-30"
            >
              <PlusIcon weight="bold" size={14} />
              Novo produto
            </button>

            <button
              type="button"
              onClick={() => openDeleteCategory(category.id, category.name)}
              className="flex items-center gap-1 text-red-500 hover:bg-red-100/50 p-1 rounded-md transition-colors"
            >
              <TrashIcon weight="bold" size={14} />
              Excluir categoria
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
