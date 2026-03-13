import { PlusIcon, TagIcon } from '@phosphor-icons/react';
import { useCallback, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { Button } from '../../../components/Button';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { ToggleSwitch } from '../../../components/ToggleSwitch';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { convertToDecimal } from '../../../functions/currency';
import { useCategoriesAutocomplete } from '../../../hooks/useCategories';
import { useCreateModel, useEditModel } from '../../../hooks/useModels';
import { CategoryItem } from '../../../types/category';
import { ModelForm, ModelItem, ModelItemForm } from '../../../types/model';

interface Props {
  defaultCategory?: Pick<CategoryItem, 'id' | 'name'>;
  defaultModel?: ModelItemForm;
  onCreate?: (newModel: ModelItem) => void;
}

export function ModelFormDrawer({ defaultCategory, defaultModel, onCreate }: Props) {
  const isEditMode = !!defaultModel;

  const [hasVariants, setHasVariants] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  const { closeDialog } = useDialog();

  const { mutate: createModel, isPending: isCreating } = useCreateModel();
  const { mutate: editModel, isPending: isEditing } = useEditModel();

  const isSubmitting = isCreating || isEditing;

  const defaultValues: ModelForm | undefined = useMemo(() => {
    if (!defaultCategory) return;

    if (defaultModel) {
      const model: ModelItemForm = {
        costPrice: defaultModel.costPrice ? convertToDecimal(defaultModel.costPrice) : undefined,
        salePrice: defaultModel.salePrice ? convertToDecimal(defaultModel.salePrice) : undefined,
        ...defaultModel,
      };

      return {
        category: defaultCategory.id,
        ...model,
      };
    } else {
      return {
        category: defaultCategory.id,
        name: '',
        costPrice: undefined,
        salePrice: undefined,
        variants: [{ color: '', size: '', quantity: undefined, costPrice: undefined, salePrice: undefined }],
      };
    }
  }, [defaultModel, defaultCategory]);

  const { control, register, setValue, handleSubmit } = useForm<ModelForm>({
    defaultValues,
  });

  const { data: categories, status } = useCategoriesAutocomplete({
    fetchOnMount: true,
    search: categorySearch,
    canFetchModels: false,
  });

  const handleAddCategory = () => setValue('category', categorySearch);

  const mappedCategories = categories ? categories.map((c) => ({ label: c.name, value: c.id })) : [];
  const options = [
    ...(defaultCategory?.id && !mappedCategories.some((c) => c.value === defaultCategory.id)
      ? [{ label: defaultCategory.name, value: defaultCategory.id }]
      : []),
    ...mappedCategories,
  ];

  const onSubmit: SubmitHandler<ModelForm> = (data) => {
    const onSuccess = () => closeDialog();

    if (isEditMode) {
      editModel(data as Required<ModelForm>, { onSuccess });
    } else {
      createModel(
        { ...data, isCategoryCreation: !!categorySearch },
        {
          onSuccess: (resData) => {
            onSuccess();
            if (onCreate) {
              onCreate(resData);
            }
          },
        },
      );
    }
  };

  const onError = useCallback(() => {
    toast.error('Existem campos vazios ou inválidos.', { id: 'form-error' });
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
      <div className={defaultCategory ? 'opacity-40 pointer-events-none' : ''}>
        <Label htmlFor="name" required>
          Categoria
        </Label>

        <Controller
          name="category"
          control={control}
          rules={{ required: 'A categoria é obrigatória' }}
          render={({ field }) => (
            <Autocomplete
              placeholder="Buscar categoria..."
              value={field.value}
              showActionsOnEmpty
              status={status}
              options={options}
              onChangeInput={setCategorySearch}
              onChangeOption={field.onChange}
              renderOption={(option) => (
                <span>
                  <TagIcon weight="bold" className="inline mr-2" />
                  {option.label}
                </span>
              )}
            >
              <Autocomplete.Action onClick={handleAddCategory}>
                <PlusIcon weight="bold" />
                Adicionar categoria
              </Autocomplete.Action>
            </Autocomplete>
          )}
        />
      </div>

      <div>
        <Label htmlFor="model" required>
          Novo modelo
        </Label>
        <Input id="model" {...register('name', { required: 'O modelo é obrigatório.' })} />
      </div>

      <div className={`flex gap-4 ${hasVariants ? 'opacity-50' : ''}`}>
        <div>
          <Label htmlFor="costPrice">Preço de compra (und.)</Label>
          <Controller
            name="costPrice"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                id="costPrice"
                disabled={hasVariants}
                value={field.value as number}
                onValueChange={(val) => field.onChange(val)}
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="salePrice">Preço de venda (und.)</Label>
          <Controller
            name="salePrice"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                id="salePrice"
                disabled={hasVariants}
                value={field.value as number}
                onValueChange={(val) => field.onChange(val)}
              />
            )}
          />
        </div>

        <div>
          <Label htmlFor="quantity" required={!hasVariants}>
            Quantidade
          </Label>
          <Input
            id="quantity"
            disabled={hasVariants}
            type="number"
            {...register('quantity', {
              required: hasVariants ? false : 'A quantidade é obrigatória.',
              setValueAs: (v) => (v !== '' ? Number(v) : undefined),
            })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label className="w-fit">Habilitar variações?</Label>
        <ToggleSwitch isOn={hasVariants} onToggle={setHasVariants} />
      </div>

      <div className="flex gap-4 justify-between [&>button]:h-full">
        <Button variant="outline" onClick={() => closeDialog()} type="button">
          Cancelar
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          {isEditMode ? 'Salvar alterações' : 'Registrar produto'}
        </Button>
      </div>
    </form>
  );
}
