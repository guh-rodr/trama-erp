import { CopySimpleIcon, PlusIcon, TrashSimpleIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Controller, useFieldArray, type Control, type UseFormGetValues, type UseFormSetValue } from 'react-hook-form';
import { Autocomplete } from '../../../../components/Autocomplete/Autocomplete';
import { CurrencyInput } from '../../../../components/CurrencyInput';
import { useDialog } from '../../../../contexts/dialog/dialog-context';
import { convertToDecimal } from '../../../../functions/currency';
import { useCategoriesAutocomplete } from '../../../../hooks/useCategories';
import { ModelItem } from '../../../../types/model';
import { SaleForm } from '../../../../types/sale';
import { COLORS } from '../../../../utils/colors';
import { PRINTS } from '../../../../utils/prints';
import { SIZES } from '../../../../utils/sizes';
import { ModelFormModal } from '../../../categories/components/ModelFormModal';

interface Props {
  control: Control<SaleForm>;
  setValue: UseFormSetValue<SaleForm>;
  getValues: UseFormGetValues<SaleForm>;
}

export function ItemsFields({ control, setValue, getValues }: Props) {
  const [categorySearch, setCategorySearch] = useState('');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const {
    data: categories,
    status,
    fetchData,
  } = useCategoriesAutocomplete({
    fetchOnMount: false,
    search: categorySearch,
    canFetchModels: true,
  });

  const sorted = categories?.sort((a, b) => {
    if (b.models!.length === a.models!.length) {
      return a.name.localeCompare(b.name);
    }
    return b.models!.length - a.models!.length;
  });

  const { openDialog } = useDialog();

  const handleAddProduct = (index: number) => {
    openDialog({
      type: 'modal',
      title: 'Adicionar novo produto',
      content: (
        <ModelFormModal
          onCreate={(newModel) => {
            setValue(`items.${index}.modelId`, newModel.id);
            applyModelPricesByIdx(index, newModel);
          }}
        />
      ),
    });
  };

  const options = sorted
    ? sorted.flatMap((category) =>
        category.models!.map((model) => ({
          label: model.name,
          value: model.id,
          group: category.name,
        })),
      )
    : [];

  const applyModelPricesByIdx = (index: number, model: ModelItem) => {
    if (model?.costPrice) {
      setValue(`items.${index}.costPrice`, convertToDecimal(model.costPrice || 0));
    }

    if (model?.salePrice) {
      setValue(`items.${index}.salePrice`, convertToDecimal(model.salePrice || 0));
    }
  };

  const changeModelPricesByIdx = (modelId: string, index: number) => {
    const models = categories?.flatMap((c) => c.models) ?? [];
    const model = models.find((m) => m?.id === modelId);

    if (model) {
      applyModelPricesByIdx(index, model);
    }
  };

  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-col mt-2 border-b border-neutral-300 pb-2">
          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-2">
              <Controller
                name={`items.${index}.modelId`}
                control={control}
                rules={{ required: 'O modelo é obrigatório' }}
                render={({ field }) => (
                  <Autocomplete
                    value={field.value}
                    placeholder="Escolha o modelo"
                    status={status}
                    onOpen={fetchData}
                    onChangeInput={setCategorySearch}
                    onChangeOption={(value) => {
                      field.onChange(value);
                      changeModelPricesByIdx(value, index);
                    }}
                    options={options}
                    renderOption={(option) => <span>{option.label}</span>}
                  >
                    <Autocomplete.Action onClick={() => handleAddProduct(index)}>
                      <PlusIcon weight="bold" />
                      Novo Produto
                    </Autocomplete.Action>
                  </Autocomplete>
                )}
              />

              <Controller
                name={`items.${index}.size`}
                control={control}
                rules={{ required: 'O tamanho é obrigatório' }}
                render={({ field }) => (
                  <Autocomplete
                    value={field.value}
                    readOnly
                    placeholder="Escolha o tamanho"
                    onChangeOption={field.onChange}
                    options={SIZES}
                    renderOption={(option) => <span>{option.label}</span>}
                  />
                )}
              />
            </div>

            <div className="flex gap-2">
              <Controller
                name={`items.${index}.print`}
                control={control}
                rules={{ required: 'A estampa é obrigatória' }}
                render={({ field }) => (
                  <Autocomplete
                    value={field.value}
                    readOnly
                    placeholder="Escolha a estampa"
                    onChangeOption={field.onChange}
                    options={PRINTS}
                    renderOption={(option) => <span>{option.label}</span>}
                  />
                )}
              />

              <Controller
                name={`items.${index}.color`}
                control={control}
                rules={{ required: 'A cor é obrigatória' }}
                render={({ field }) => (
                  <Autocomplete
                    value={field.value}
                    options={COLORS}
                    readOnly
                    placeholder="Escolha a cor"
                    onChangeOption={field.onChange}
                    renderOption={(option) => {
                      const hexColor = COLORS.find((c) => c.value === option.value)?.hex;

                      return (
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded-full border border-neutral-300`}
                            style={{ background: hexColor }}
                          />
                          {option.label}
                        </div>
                      );
                    }}
                  />
                )}
              />
            </div>

            <div className="flex gap-2">
              <Controller
                name={`items.${index}.costPrice`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CurrencyInput
                    placeholder="Preço de compra"
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                )}
              />

              <Controller
                name={`items.${index}.salePrice`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CurrencyInput
                    placeholder="Preço de venda"
                    value={field.value}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                )}
              />
            </div>
          </div>

          <div className="text-sm flex gap-4 font-medium mt-1">
            <button
              className="text-emerald-500 transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
              type="button"
              onClick={() =>
                append({
                  modelId: '',
                  color: '',
                  print: '',
                  size: '',
                  costPrice: 0,
                  salePrice: 0,
                })
              }
            >
              <PlusIcon weight="bold" /> Novo item
            </button>

            <button
              className="text-indigo-500 transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
              type="button"
              onClick={() => {
                append(getValues(`items.${index}`));
              }}
            >
              <CopySimpleIcon weight="bold" /> Duplicar
            </button>

            {fields.length !== 1 && (
              <button
                className="text-red-500 transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
                type="button"
                onClick={() => remove(index)}
              >
                <TrashSimpleIcon weight="bold" /> Remover
              </button>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
