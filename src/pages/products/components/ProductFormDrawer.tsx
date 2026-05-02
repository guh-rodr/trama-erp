import { PlusIcon, TagIcon } from '@phosphor-icons/react';
import { useCallback, useMemo, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { Button } from '../../../components/Button';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { Input } from '../../../components/Input';
import { Label } from '../../../components/Label';
import { LoadingNotification } from '../../../components/LoadingNotification';
import { useDialog } from '../../../contexts/dialog/dialog-context';
import { convertToDecimal } from '../../../functions/currency';
import { useCategoriesAutocomplete } from '../../../hooks/useCategories';
import { useCreateProduct, useFetchProduct, useUpdateProduct } from '../../../hooks/useProducts';
import { CategoryItem } from '../../../types/category';
import { ProductForm, ProductItem, ProductVariantForm } from '../../../types/product';
import { ProductTypeCard } from './ProductTypeCard';
import { ProductTypeConversion } from './ProductTypeConversion';
import { ProductVariantsTable } from './ProductVariantsTable';

interface Props {
  defaultCategory?: Pick<CategoryItem, 'id' | 'name'>;
  defaultProductId?: string;
  onCreate?: (newProduct: ProductItem) => void;
}

export function ProductFormDrawer({ defaultCategory, defaultProductId = '', onCreate }: Props) {
  const { data: defaultProduct, isFetching } = useFetchProduct({ id: defaultProductId });

  const isEditMode = !!defaultProduct;

  const [categorySearch, setCategorySearch] = useState('');

  const { openDialog, closeDialog } = useDialog();

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isEditing } = useUpdateProduct();

  const isSubmitting = isCreating || isEditing;

  const defaultValues: ProductForm | undefined = useMemo(() => {
    const defaultVariant: ProductVariantForm = { color: '', size: '', status: 'added' };
    if (!defaultCategory) return;

    if (defaultProduct) {
      if (defaultProduct.isVariable) {
        const variants = defaultProduct.variants.map(({ hasSales: _hasSales, ...v }) => ({
          ...v,
          costPrice: convertToDecimal(v.costPrice!),
          salePrice: convertToDecimal(v.salePrice!),
          status: 'idle' as const,
        }));

        return {
          id: defaultProduct.id,
          type: defaultProduct.isVariable ? 'variable' : 'simple',
          name: defaultProduct.name,
          category: defaultCategory.id,
          variants,
        };
      } else {
        return {
          id: defaultProduct.id,
          type: defaultProduct.isVariable ? 'variable' : 'simple',
          name: defaultProduct.name,
          category: defaultCategory.id,
          costPrice: defaultProduct.costPrice ? convertToDecimal(defaultProduct.costPrice) : undefined,
          salePrice: defaultProduct.salePrice ? convertToDecimal(defaultProduct.salePrice) : undefined,
          quantity: defaultProduct.quantity,
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
  }, [defaultCategory, defaultProduct]);

  const { control, register, setValue, handleSubmit, getValues, getFieldState, watch } = useForm<ProductForm>({
    values: defaultValues,
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

  const onSubmit: SubmitHandler<ProductForm> = (data) => {
    const onSuccess = () => closeDialog();

    if (isEditMode) {
      updateProduct(
        {
          ...(data as Required<ProductForm>),
          variants: type === 'variable' ? (data.variants ?? []) : [],
        },
        { onSuccess },
      );
    } else {
      const variantsWithoutStatus =
        type === 'variable' ? data.variants?.map(({ status: _status, ...v }) => ({ ...v })) : [];

      createProduct(
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

    if (isEditMode && !defaultProduct.isVariable && defaultProduct.itemCount > 0) {
      openDialog({
        type: 'modal',
        title: 'Habilitar variantes?',
        content: (
          <ProductTypeConversion onConfirm={toggleToVariable} newType="variable" quantity={defaultProduct.quantity} />
        ),
      });

      return;
    }

    toggleToVariable();
  };

  const handleToggleToSimple = () => {
    const toggleToSimple = () => handleToggleType('simple');

    const totalStockQuantity =
      (defaultProduct?.isVariable ? defaultProduct.variants.reduce((acc, curr) => acc + curr.quantity, 0) : 0) ?? 0;

    if (isEditMode && totalStockQuantity > 0) {
      openDialog({
        type: 'modal',
        title: 'Desabilitar variantes?',
        content: <ProductTypeConversion onConfirm={toggleToSimple} newType="simple" quantity={totalStockQuantity} />,
      });

      return;
    }

    toggleToSimple();
  };

  const handleToggleType = (newValue: ProductForm['type']) => {
    if (type === newValue) return;
    setValue('type', newValue);
  };

  if (isFetching) {
    return <LoadingNotification />;
  }

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
          <Label htmlFor="name" required>
            {isEditMode ? 'Produto' : 'Novo produto'}
          </Label>
          <Input id="name" {...register('name', { required: 'O Produto é obrigatório.' })} />
        </div>

        <div>
          {isEditMode ? (
            <>
              <Label required>Tipo</Label>

              <div className="flex gap-4">
                <ProductTypeCard
                  title="Produto simples"
                  description="Peça única, sem variação de cor ou tamanho"
                  isCurrent={!defaultProduct.isVariable}
                  isSelected={type === 'simple'}
                  mode="static"
                  action={
                    type === 'variable' ? { label: 'Converter para simples', onClick: handleToggleToSimple } : undefined
                  }
                />
                <ProductTypeCard
                  title="Produto variado"
                  description="Possui cor, tamanho ou outras combinações"
                  isCurrent={defaultProduct.isVariable}
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
                <ProductTypeCard
                  title="Produto simples"
                  description="Peça única, sem variação de cor ou tamanho"
                  mode="select"
                  onSelect={() => handleToggleType('simple')}
                  isCurrent={type === 'simple'}
                  isSelected={type === 'simple'}
                />
                <ProductTypeCard
                  title="Produto variado"
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
                disabled={isEditMode && !defaultProduct.isVariable}
                title={
                  isEditMode && !defaultProduct.isVariable ? 'Não é possível alterar a quantidade por aqui' : undefined
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
          <ProductVariantsTable
            control={control}
            inEditMode={!!defaultProduct}
            variants={defaultProduct?.isVariable ? defaultProduct.variants : []}
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
