import { TrashIcon } from '@phosphor-icons/react';
import { useMemo, useState } from 'react';
import { Controller, UseFieldArrayRemove, useFormContext, useWatch } from 'react-hook-form';
import { Autocomplete } from '../../../../components/Autocomplete/Autocomplete';
import { CurrencyInput } from '../../../../components/CurrencyInput';
import { convertToDecimal } from '../../../../functions/currency';
import { useCategoriesAutocomplete } from '../../../../hooks/useCategories';
import { useProductVariants } from '../../../../hooks/useProducts';
import { SaleForm } from '../../../../types/sale';
import { COLORS } from '../../../../utils/colors';

interface Props {
  index: number;
  remove: UseFieldArrayRemove;
}

export function SaleItemRow({ index, remove }: Props) {
  const { control, setValue } = useFormContext<SaleForm>();

  const [categorySearch, setCategorySearch] = useState('');

  const { data, status, fetchData } = useCategoriesAutocomplete({
    fetchOnMount: false,
    search: categorySearch,
    canFetchModels: true,
  });

  const options =
    data?.flatMap((category) =>
      category.products!.map((product) => ({
        label: product.name,
        value: product.id,
        group: category.name,
      })),
    ) ?? [];

  const [productId, variantId] = useWatch({ control, name: [`items.${index}.productId`, `items.${index}.variantId`] });

  const { data: variants } = useProductVariants({ id: productId });

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
    <tr key={index} className={`border-y border-neutral-200 text-sm relative *:p-2`}>
      <td className="relative">
        <Controller
          name={`items.${index}.productId`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Autocomplete
              className="!w-full"
              value={field.value}
              placeholder="Produto..."
              status={status}
              options={options}
              onOpen={fetchData}
              onChangeInput={setCategorySearch}
              onChangeOption={(value) => {
                field.onChange(value);
              }}
            />
          )}
        />
      </td>

      <td className="relative [&>div]:maxa-w-[110px]">
        <Controller
          name={`items.${index}.variantId`}
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Autocomplete
              className="max-w-[160px]"
              value={field.value}
              placeholder="Variante..."
              status={status}
              readOnly
              onChangeOption={(value) => {
                field.onChange(value);

                const variant = variants?.find((v) => v.id === value);
                if (variant) {
                  setValue(`items.${index}.salePrice`, convertToDecimal(variant.salePrice!));
                }
              }}
              options={variantsOptions}
              renderOption={(option) => {
                const quantity = variants?.find((v) => v.id === option.value)?.quantity ?? 0;

                return (
                  <span>
                    {option.label}
                    <span className="bg-indigo-100/50 text-indigo-500 px-1.5 rounded-full float-right">{quantity}</span>
                  </span>
                );
              }}
            />
          )}
        />
      </td>

      <td>
        <CurrencyInput
          disabled
          value={selectedVariant ? convertToDecimal(selectedVariant.costPrice!) : undefined}
          className="max-w-[110px] disabled:opacity-50 disabled:border-neutral-300"
        />
      </td>

      <td>
        <Controller
          name={`items.${index}.salePrice`}
          control={control}
          rules={{ required: 'O preço de venda é obrigatório' }}
          render={({ field }) => (
            <CurrencyInput
              {...field}
              onValueChange={field.onChange}
              className="max-w-[110px] disabled:opacity-50 disabled:border-neutral-300"
            />
          )}
        />
      </td>

      <td className="!pl-0 ignore">
        <button
          className="text-red-400 rounded-md enabled:hover:bg-red-100/40 size-full p-3 transition-colors mr-0 ml-auto disabled:opacity-50 disabled:!cursor-default"
          type="button"
          onClick={() => remove(index)}
        >
          <TrashIcon size={16} weight="bold" />
        </button>
      </td>
    </tr>
  );
}
