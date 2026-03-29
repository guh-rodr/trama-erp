import { ArrowUUpLeftIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react';
import {
  Control,
  Controller,
  useFieldArray,
  UseFormGetFieldState,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { Input } from '../../../components/Input';
import { ModelForm, ModelVariant } from '../../../types/model';
import { COLORS } from '../../../utils/colors';
import { SIZES } from '../../../utils/sizes';

interface Props {
  control: Control<ModelForm>;
  inEditMode?: boolean;
  variants: ModelVariant[];
  getValues: UseFormGetValues<ModelForm>;
  setValue: UseFormSetValue<ModelForm>;
  getFieldState: UseFormGetFieldState<ModelForm>;
}

export function ModelVariantsTable({
  control,
  inEditMode = false,
  variants,
  getValues,
  setValue,
  getFieldState,
}: Props) {
  const { append, remove, update, fields } = useFieldArray({
    control,
    name: 'variants',
    keyName: 'fieldId',
  });

  const markVariantAsModified = (index: number) => {
    const fieldState = getFieldState(`variants.${index}`);
    const variant = getValues(`variants.${index}`);

    if (variant.status === 'idle' && fieldState.isDirty) {
      setValue(`variants.${index}.status`, 'modified');
    } else if (variant.status === 'modified' && !fieldState.isDirty) {
      setValue(`variants.${index}.status`, 'idle');
    }
  };

  const handleAddVariant = () => {
    append({ color: '', size: '', status: 'added' }, { shouldFocus: false });
  };

  const handleRemoveVariant = (index: number, fieldVariant: NonNullable<ModelForm['variants']>[number]) => {
    const canMarkAsRemoved = ['idle', 'updated'].includes(fieldVariant.status!);

    if (inEditMode && canMarkAsRemoved) {
      update(index, { ...fieldVariant, status: 'removed' });
    } else {
      remove(index);
    }
  };

  const handleUndoVariantRemove = (index: number, fieldVariant: NonNullable<ModelForm['variants']>[number]) => {
    update(index, { ...fieldVariant, status: 'idle' });
  };

  const hasVariantSales = (id?: string) => {
    if (!id) return false;
    return variants.find((v) => v.id === id)?.hasSales ?? false;
  };

  return (
    <div className="space-y-2">
      <table className="rounded-xl text-left bg-white shadow-sm w-full">
        <thead>
          <tr className="text-neutral-700 uppercase text-xs *:p-3">
            <th>Cor</th>
            <th>Tam.</th>
            <th>Qntd.</th>
            <th>P. Compra (und.)</th>
            <th>P. Venda (und.)</th>
            <th></th>
          </tr>
        </thead>

        <tbody className="relative">
          {fields.map((variantField, index) => (
            <tr
              key={variantField.fieldId}
              className={`border-y border-neutral-200 text-sm relative *:p-2 ${variantField.status === 'removed' ? '[&>*:not(.ignore)]:opacity-50' : ''}`}
            >
              <td className="!w-[180px] relative">
                {hasVariantSales(variantField.id) && (
                  <div
                    title="Essa variante já possui uma venda, não é possível alterar esse campo"
                    className="absolute z-50 inset-0 bg-white/50"
                  />
                )}

                <Controller
                  name={`variants.${index}.color`}
                  control={control}
                  rules={{ required: 'A cor é obrigatória' }}
                  render={({ field }) => (
                    <Autocomplete
                      value={field.value}
                      options={COLORS}
                      readOnly
                      disabled={variantField.status === 'removed' || hasVariantSales(variantField.id)}
                      placeholder="Escolha a cor"
                      onChangeOption={(e) => {
                        field.onChange(e);
                        markVariantAsModified(index);
                      }}
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
              </td>

              <td className="!w-[90px] relative">
                {hasVariantSales(variantField.id) && (
                  <div
                    title="Essa variante já possui uma venda, não é possível alterar esse campo"
                    className="absolute z-50 inset-0 bg-white/50"
                  />
                )}

                <Controller
                  name={`variants.${index}.size`}
                  control={control}
                  rules={{ required: 'O tamanho é obrigatório' }}
                  render={({ field }) => (
                    <Autocomplete
                      readOnly
                      disabled={variantField.status === 'removed' || hasVariantSales(variantField.id)}
                      placeholder="Tam."
                      options={SIZES}
                      value={field.value}
                      onChangeOption={(e) => {
                        field.onChange(e);
                        markVariantAsModified(index);
                      }}
                    />
                  )}
                />
              </td>

              <td>
                <Controller
                  name={`variants.${index}.quantity`}
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      className="!w-[70px]"
                      disabled={variantField.status === 'removed'}
                      type="number"
                      placeholder="Qntd."
                      value={field.value ?? ''}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                        markVariantAsModified(index);
                      }}
                    />
                  )}
                />
              </td>

              <td className="max-w-36">
                <Controller
                  name={`variants.${index}.costPrice`}
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      disabled={variantField.status === 'removed'}
                      value={field.value as number}
                      onValueChange={(val) => {
                        field.onChange(val);
                        markVariantAsModified(index);
                      }}
                    />
                  )}
                />
              </td>

              <td className="max-w-36">
                <Controller
                  name={`variants.${index}.salePrice`}
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      disabled={variantField.status === 'removed'}
                      value={field.value as number}
                      onValueChange={(val) => {
                        field.onChange(val);
                        markVariantAsModified(index);
                      }}
                    />
                  )}
                />
              </td>

              <td className="!pl-0 ignore">
                {variantField.status === 'removed' ? (
                  <button
                    className="text-blue-400 rounded-md enabled:hover:bg-blue-100/40 size-full p-3 transition-colors mr-0 ml-auto disabled:opacity-50 disabled:!cursor-default"
                    type="button"
                    disabled={!inEditMode && fields.length === 1}
                    onClick={() => handleUndoVariantRemove(index, variantField)}
                  >
                    <ArrowUUpLeftIcon size={16} weight="bold" />
                  </button>
                ) : (
                  <button
                    className="text-red-400 rounded-md enabled:hover:bg-red-100/40 size-full p-3 transition-colors mr-0 ml-auto disabled:opacity-50 disabled:!cursor-default"
                    type="button"
                    disabled={!inEditMode && fields.length === 1}
                    onClick={() => handleRemoveVariant(index, variantField)}
                  >
                    <TrashIcon size={16} weight="bold" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="text-emerald-500 text-sm transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
        type="button"
        onClick={handleAddVariant}
      >
        <PlusIcon weight="bold" /> Nova variação
      </button>
    </div>
  );
}
