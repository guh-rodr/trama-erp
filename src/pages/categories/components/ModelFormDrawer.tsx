import { PlusIcon, TagIcon } from '@phosphor-icons/react';
import { useCallback, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { Button } from '../../../components/Button';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { convertToDecimal } from '../../../functions/currency';
import { useCategoriesAutocomplete } from '../../../hooks/useCategories';
import { useCreateModel, useEditModel } from '../../../hooks/useModels';
import { CategoryItem } from '../../../types/category';
import { ModelForm, ModelItem, ModelVariantForm } from '../../../types/model';
import { ModelTypeCard } from './ModelTypeCard';
import { ModelTypeConversion } from './ModelTypeConversion';
import { ModelVariantsTable } from './ModelVariantsTable';

interface Props {
  defaultCategory?: Pick<CategoryItem, 'id' | 'name'>;
  defaultModel?: ModelItem;
  onCreate?: (newModel: ModelItem) => void;
}

export function ModelFormDrawer({ defaultCategory, defaultModel, onCreate }: Props) {
  const isEditMode = !!defaultModel;

  const [categorySearch, setCategorySearch] = useState('');

  const { openDialog, closeDialog } = useDialog();

  const { mutate: createModel, isPending: isCreating } = useCreateModel();
  const { mutate: editModel, isPending: isEditing } = useEditModel();

  const isSubmitting = isCreating || isEditing;

  const defaultValues: ModelForm | undefined = useMemo(() => {
    const defaultVariant: ModelVariantForm = { color: '', size: '', status: 'added' };
    if (!defaultCategory) return;

    if (defaultModel) {
      if (defaultModel.isVariable) {
        const variants = defaultModel.variants.map(
          ({ hasSales: _hasSales, ...v }): ModelVariantForm => ({
            ...v,
            costPrice: convertToDecimal(v.costPrice!),
            salePrice: convertToDecimal(v.salePrice!),
            status: 'idle' as const,
          }),
        );

        return {
          id: defaultModel.id,
          type: defaultModel.isVariable ? 'variable' : 'simple',
          name: defaultModel.name,
          category: defaultCategory.id,
          variants,
        };
      } else {
        return {
          id: defaultModel.id,
          type: defaultModel.isVariable ? 'variable' : 'simple',
          name: defaultModel.name,
          category: defaultCategory.id,
          costPrice: defaultModel.costPrice ? convertToDecimal(defaultModel.costPrice) : undefined,
          salePrice: defaultModel.salePrice ? convertToDecimal(defaultModel.salePrice) : undefined,
          quantity: defaultModel.quantity,
          variants: [defaultVariant],
        };
      }
    } else {
      return {
        type: 'simple',
        category: defaultCategory.id,
        name: '',
        variants: [defaultVariant],
      };
    }
  }, [defaultModel, defaultCategory]);

  const { control, register, setValue, handleSubmit, getValues, getFieldState, watch } = useForm<ModelForm>({
    defaultValues,
  });

  const type = watch('type');

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
      editModel(
        {
          ...(data as Required<ModelForm>),
          variants: type === 'variable' ? (data.variants ?? []) : [],
        },
        { onSuccess },
      );
    } else {
      const variantsWithoutStatus =
        type === 'variable' ? data.variants?.map(({ status: _status, ...v }) => ({ ...v })) : [];

      createModel(
        { ...data, variants: variantsWithoutStatus, isCategoryCreation: !!categorySearch },
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

  const handleToggleToVariable = () => {
    const toggleToVariable = () => handleToggleType('variable');

    if (isEditMode && !defaultModel.isVariable && defaultModel.itemCount > 0) {
      openDialog({
        type: 'modal',
        title: 'Habilitar variantes?',
        content: (
          <ModelTypeConversion onConfirm={toggleToVariable} newType="variable" quantity={defaultModel.quantity} />
        ),
      });

      return;
    }

    toggleToVariable();
  };

  const handleToggleToSimple = () => {
    const toggleToSimple = () => handleToggleType('simple');

    const totalStockQuantity =
      (defaultModel?.isVariable ? defaultModel.variants.reduce((acc, curr) => acc + curr.quantity, 0) : 0) ?? 0;

    if (isEditMode && totalStockQuantity > 0) {
      openDialog({
        type: 'modal',
        title: 'Desabilitar variantes?',
        content: <ModelTypeConversion onConfirm={toggleToSimple} newType="simple" quantity={totalStockQuantity} />,
      });

      return;
    }

    toggleToSimple();
  };

  const handleToggleType = (newValue: ModelForm['type']) => {
    if (type === newValue) return;
    setValue('type', newValue);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col justify-between gap-4 h-full">
      <div className="space-y-4">
        <div className="has-disabled:opacity-50">
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
                disabled={isEditMode}
                className="disabled:border-neutral-300"
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
            {isEditMode ? 'Modelo' : 'Novo modelo'}
          </Label>
          <Input id="model" {...register('name', { required: 'O modelo é obrigatório.' })} />
        </div>

        <div>
          {isEditMode ? (
            <>
              <Label required>Tipo</Label>

              <div className="flex gap-4">
                <ModelTypeCard
                  title="Modelo simples"
                  description="Peça única, sem variação de cor ou tamanho"
                  isCurrent={!defaultModel.isVariable}
                  isSelected={type === 'simple'}
                  mode="static"
                  action={
                    type === 'variable' ? { label: 'Converter para simples', onClick: handleToggleToSimple } : undefined
                  }
                />
                <ModelTypeCard
                  title="Modelo variado"
                  description="Possui cor, tamanho ou outras combinações"
                  isCurrent={defaultModel.isVariable}
                  isSelected={type === 'variable'}
                  mode="static"
                  action={
                    type === 'simple' ? { label: 'Converter para variado', onClick: handleToggleToVariable } : undefined
                  }
                />
              </div>
            </>
          ) : (
            <>
              <Label required>Tipo</Label>

              <div className="flex gap-4">
                <ModelTypeCard
                  title="Modelo simples"
                  description="Peça única, sem variação de cor ou tamanho"
                  mode="select"
                  onSelect={() => handleToggleType('simple')}
                  isCurrent={type === 'simple'}
                  isSelected={type === 'simple'}
                />
                <ModelTypeCard
                  title="Modelo variado"
                  description="Possui cor, tamanho ou outras combinações"
                  onSelect={() => handleToggleType('variable')}
                  mode="select"
                  isCurrent={type === 'variable'}
                  isSelected={type === 'variable'}
                />
              </div>
            </>
          )}
        </div>

        {type === 'simple' && (
          <div className="flex gap-4">
            <div>
              <Label htmlFor="costPrice">Preço de compra (und.)</Label>
              <Controller
                name="costPrice"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="costPrice"
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
                    value={field.value as number}
                    onValueChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </div>

            <div className="has-disabled:opacity-50">
              <Label htmlFor="quantity" required>
                Quantidade
              </Label>
              <Input
                className="disabled:border-neutral-300"
                id="quantity"
                type="number"
                disabled={isEditMode && !defaultModel.isVariable}
                title={
                  isEditMode && !defaultModel.isVariable ? 'Não é possível alterar a quantidade por aqui' : undefined
                }
                {...register('quantity', {
                  required: !isEditMode,
                  setValueAs: (v) => (v !== '' ? Number(v) : undefined),
                })}
              />
            </div>
          </div>
        )}

        {type === 'variable' && (
          <ModelVariantsTable
            control={control}
            inEditMode={!!defaultModel}
            variants={defaultModel?.isVariable ? defaultModel.variants : []}
            setValue={setValue}
            getValues={getValues}
            getFieldState={getFieldState}
          />
        )}
      </div>

      <div className="flex gap-4 justify-between [&>button]:h-full">
        <Button className="flex-1" variant="outline" onClick={() => closeDialog()} type="button">
          Cancelar
        </Button>

        <Button className="flex-1" type="submit" isLoading={isSubmitting}>
          {isEditMode ? 'Salvar alterações' : 'Registrar produto'}
        </Button>
      </div>
    </form>
  );
}
