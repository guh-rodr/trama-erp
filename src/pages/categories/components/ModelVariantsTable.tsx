import { PlusIcon, TrashIcon } from '@phosphor-icons/react';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { Input } from '../../../components/Input';
import { ModelForm } from '../../../types/model';
import { COLORS } from '../../../utils/colors';
import { SIZES } from '../../../utils/sizes';

interface Props {
  control: Control<ModelForm>;
  inEditMode?: boolean;
}

export function ModelVariantsTable({ control }: Props) {
  const { append, remove, fields } = useFieldArray({
    control,
    name: 'variants',
  });

  const handleAddVariant = () => {
    append({ color: '', size: '', quantity: undefined }, { shouldFocus: false });
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

        <tbody>
          {fields.map((field, index) => (
            <tr key={field.id} className="border-y border-neutral-200 text-sm *:p-2">
              <td className="!w-[180px]">
                <Controller
                  name={`variants.${index}.color`}
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
              </td>

              <td className="!w-[90px]">
                <Controller
                  name={`variants.${index}.size`}
                  control={control}
                  rules={{ required: 'O tamanho é obrigatório' }}
                  render={({ field }) => (
                    <Autocomplete
                      readOnly
                      placeholder="Tam."
                      options={SIZES}
                      value={field.value}
                      onChangeOption={field.onChange}
                    />
                  )}
                />
              </td>

              <td>
                <Input
                  className="!w-[70px]"
                  type="number"
                  placeholder="Qntd."
                  {...control.register(`variants.${index}.quantity`, { valueAsNumber: true, required: true })}
                />
              </td>

              <td className="max-w-36">
                <Controller
                  name={`variants.${index}.costPrice`}
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput value={field.value as number} onValueChange={(val) => field.onChange(val)} />
                  )}
                />
              </td>

              <td className="max-w-36">
                <Controller
                  name={`variants.${index}.salePrice`}
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput value={field.value as number} onValueChange={(val) => field.onChange(val)} />
                  )}
                />
              </td>

              <td className="!pl-0">
                <button
                  className="text-red-400 rounded-md enabled:hover:bg-red-100/40 size-full p-3 transition-colors mr-0 ml-auto disabled:opacity-50 disabled:!cursor-default"
                  type="button"
                  disabled={!inEditMode && fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <TrashIcon size={16} weight="bold" />
                </button>
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
