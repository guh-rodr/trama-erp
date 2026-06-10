import { PlusIcon } from '@phosphor-icons/react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { SaleForm } from '../../../../types/sale';
import { SaleItemRow } from './SaleItemRow';

export function SaleItemsTable() {
  const { control } = useFormContext<SaleForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <div className="space-y-2">
      <table className="rounded-xl text-left bg-white shadow-sm w-full">
        <thead>
          <tr className="text-neutral-700 uppercase text-xs *:p-3">
            <th>Produto</th>
            <th>Variante</th>
            <th>P. Compra</th>
            <th>P. Venda</th>
            <th></th>
          </tr>
        </thead>

        <tbody className="relative">
          {fields.map((_, index) => (
            <SaleItemRow index={index} remove={remove} />
          ))}
        </tbody>
      </table>

      <button
        className="text-emerald-500 text-sm transition-opacity cursor-pointer hover:opacity-70 flex items-center gap-1"
        type="button"
        onClick={() => append({ productId: '', variantId: '' })}
      >
        <PlusIcon weight="bold" /> Novo item
      </button>
    </div>
  );
}
