import { CaretRightIcon, CheckIcon, PencilLineIcon, PlusIcon, TrashIcon, XIcon } from '@phosphor-icons/react';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { useEditCategory } from '../../../hooks/useCategories';
import { CategoryItem, EditCategoryForm } from '../../../types/category';
import { ModelItem, ModelItemForm } from '../../../types/model';
import { CategoryDeleteModal } from './CategoryDeleteModal';
import { ModelCard } from './ModelCard';
import { ModelDeleteModal } from './ModelDeleteModal';
import { ModelFormDrawer } from './ModelFormDrawer';

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
  const [models, setModels] = useState<ModelItem[]>([]);

  const fetchedModels = category.models!;

  useEffect(() => {
    const registeredModels = fetchedModels.map((m) => ({
      ...m,
      isTemp: false,
    }));

    setModels(registeredModels);
  }, [category.models, fetchedModels]);

  const openDeleteModal = (rowId: string, rowName: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <CategoryDeleteModal id={rowId} name={rowName} />,
    });
  };

  const handleAddModel = () => {
    openDialog({
      type: 'drawer',
      title: 'Adicionar novo modelo',
      content: <ModelFormDrawer defaultCategory={category} />,
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

  const openModelDeleteModal = (modelId: string, modelName: string) => {
    openDialog({
      title: 'Confirmar ação',
      type: 'modal',
      content: <ModelDeleteModal categoryId={category.id} modelId={modelId} modelName={modelName} />,
    });
  };

  const handleEditModel = (model: ModelItem) => {
    const defaultModel: ModelItemForm = {
      id: model.id,
      name: model.name,
      costPrice: model.costPrice,
      salePrice: model.salePrice,
      variants: [],
    };

    openDialog({
      type: 'drawer',
      title: 'Editar modelo',
      content: <ModelFormDrawer defaultCategory={category} defaultModel={defaultModel} />,
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
          {fetchedModels.length || 'Nenhum'} {fetchedModels.length > 1 ? 'modelos' : 'modelo'}
        </p>

        <CaretRightIcon
          weight="bold"
          size={18}
          className={`text-neutral-500 absolute right-0 -mt-9 mr-4 transition-transform ${category.id === expandedCategoryId ? 'rotate-90' : ''}`}
        />
      </div>

      {category.id === expandedCategoryId && (
        <div className={`p-4 flex flex-col gap-4 border-t border-y-neutral-200`}>
          {!!models.length && (
            <div className="flex flex-wrap gap-4">
              {models.map((model) => (
                <ModelCard
                  key={model.id}
                  name={model.name}
                  itemsCount={model.itemCount}
                  onEdit={() => handleEditModel(model)}
                  onDelete={() => openModelDeleteModal(model.id, model.name)}
                />
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={handleAddModel}
              className="flex items-center gap-1 text-emerald-500 enabled:hover:bg-emerald-100/50 p-1 rounded-md transition-all disabled:opacity-30"
            >
              <PlusIcon weight="bold" size={14} />
              Novo modelo
            </button>

            <button
              type="button"
              onClick={() => openDeleteModal(category.id, category.name)}
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
