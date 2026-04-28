import { CopySimpleIcon, PlusIcon, TrashSimpleIcon } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { Control, Controller, useWatch } from 'react-hook-form';
import { Autocomplete } from '../../../../components/Autocomplete/Autocomplete';
import { CurrencyInput } from '../../../../components/CurrencyInput';
import { convertToDecimal } from '../../../../functions/currency';
import { useCategoriesAutocomplete } from '../../../../hooks/useCategories';
import { useFetchModelVariants } from '../../../../hooks/useModels';
import { SaleForm } from '../../../../types/sale';
import { COLORS } from '../../../../utils/colors';

interface Props {
  index: number;
  control: Control<SaleForm>;
  canRemove: boolean;
  onToggleModel: (newModelId: string) => void;
  onAdd: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

export function ItemField({ index, control, canRemove, onToggleModel, onAdd, onDuplicate, onRemove }: Props) {
  const [categorySearch, setCategorySearch] = useState('');

  const { data, status, fetchData } = useCategoriesAutocomplete({
    fetchOnMount: false,
    search: categorySearch,
    canFetchModels: true,
  });

  const modelsOptions =
    data?.flatMap((category) =>
      category.models!.map((model) => ({
        label: model.name,
        value: model.id,
        group: category.name,
      })),
    ) ?? [];

  const [modelId, variantId] = useWatch({ control, name: [`items.${index}.modelId`, `items.${index}.variantId`] });

  const { data: variants } = useFetchModelVariants({ id: modelId });

  const variantsOptions = useMemo(
    () =>
      variants?.map((variant) => {
        const isDefault = !variant.color && !variant.size;
        const colorName = variant.color && COLORS.find((c) => c.value === variant.color)?.label;

        return {
          label: isDefault ? 'Variante padrão' : `${variant.size?.toUpperCase()} · ${colorName}`,
          value: variant.id!,
        };
      }) ?? [],
    [variants],
  );

  const selectedVariant = useMemo(() => variants?.find((v) => v.id === variantId), [variantId, variants]);

  return (
    <div className="flex flex-col gap-1 mt-2 border-b border-neutral-300 pb-2 w-full">
      <div className="flex gap-1 [&>div]:w-full">
        <Controller
          name={`items.${index}.modelId`}
          control={control}
          rules={{ required: 'O modelo é obrigatório' }}
          render={({ field }) => (
            <Autocomplete
              className="!w-full"
              value={field.value}
              placeholder="Escolha o modelo"
              status={status}
              options={modelsOptions}
              onOpen={fetchData}
              onChangeInput={setCategorySearch}
              onChangeOption={(value) => {
                field.onChange(value);

                if (field.value !== value) {
                  onToggleModel(value);
                }
              }}
            />
          )}
        />

        {variantsOptions.length > 0 && (
          <Controller
            name={`items.${index}.variantId`}
            control={control}
            rules={{ required: 'A variante é obrigatória' }}
            render={({ field }) => (
              <Autocomplete
                value={field.value}
                placeholder="Escolha a variante"
                status={status}
                readOnly
                onChangeOption={(value) => {
                  field.onChange(value);
                }}
                options={variantsOptions}
                renderOption={(option) => {
                  const quantity = variants?.find((v) => v.id === option.value)?.quantity ?? 0;

                  return (
                    <span>
                      {option.label}
                      <span className="bg-indigo-100/50 text-indigo-500 px-1.5 rounded-full float-right">
                        {quantity}
                      </span>
                    </span>
                  );
                }}
              />
            )}
          />
        )}
      </div>

      {selectedVariant && (
        <div className="flex gap-2">
          <CurrencyInput
            disabled
            value={convertToDecimal(selectedVariant.costPrice!)}
            className="disabled:opacity-50 disabled:border-neutral-300"
          />

          <Controller
            name={`items.${index}.salePrice`}
            control={control}
            defaultValue={convertToDecimal(selectedVariant.salePrice!)}
            rules={{ required: 'O preço de venda é obrigatório' }}
            render={({ field }) => <CurrencyInput {...field} onValueChange={field.onChange} />}
          />
        </div>
      )}

      <div className="text-sm flex gap-4 font-medium mt-1">
        <button
          className="text-emerald-500 transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
          type="button"
          onClick={onAdd}
        >
          <PlusIcon weight="bold" /> Novo item
        </button>

        <button
          className="text-indigo-500 transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
          type="button"
          onClick={onDuplicate}
        >
          <CopySimpleIcon weight="bold" /> Duplicar
        </button>

        {canRemove && (
          <button
            className="text-red-500 transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
            type="button"
            onClick={onRemove}
          >
            <TrashSimpleIcon weight="bold" /> Remover
          </button>
        )}
      </div>
    </div>
  );
}
