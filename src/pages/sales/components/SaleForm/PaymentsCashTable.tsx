import { TrashIcon } from '@phosphor-icons/react';
import { Controller, UseFieldArrayRemove, useFormContext } from 'react-hook-form';
import { Autocomplete } from '../../../../components/Autocomplete/Autocomplete';
import { CurrencyInput } from '../../../../components/CurrencyInput';
import { convertToDecimal } from '../../../../functions/currency';
import { SaleForm } from '../../../../types/sale';

interface Props {
  payments: SaleForm['payments'];
  removePayment: UseFieldArrayRemove;
  total: number;
}

export function PaymentsCashTable({ payments, removePayment, total }: Props) {
  const { control } = useFormContext<SaleForm>();

  return (
    <div>
      <table className="rounded-xl text-left bg-white shadow-sm w-full">
        <thead>
          <tr className="text-neutral-800 uppercase text-xs *:p-3">
            <th>Pagamento</th>
            <th>Valor</th>
            <th></th>
          </tr>
        </thead>

        <tbody className="relative">
          {payments.map((_, idx) => {
            return (
              <tr key={idx} className={`border-y border-neutral-200 text-sm relative *:p-2`}>
                <td>
                  <Controller
                    name={`payments.${idx}.method`}
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        placeholder="Forma"
                        value={field.value}
                        onChangeOption={field.onChange}
                        className="h-9"
                        readOnly
                        options={[
                          { label: 'Dinheiro', value: 'CASH' },
                          { label: 'Pix', value: 'PIX' },
                          { label: 'Cartão de crédito', value: 'CREDIT_CARD' },
                          { label: 'Cartão de débito', value: 'DEBIT_CARD' },
                        ]}
                      />
                    )}
                  />
                </td>

                <td>
                  <Controller
                    name={`payments.${idx}.value`}
                    rules={{ required: true, min: convertToDecimal(total / payments.length) }}
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput {...field} placeholder="Valor" className="h-9" onValueChange={field.onChange} />
                    )}
                  />
                </td>

                <td className="!pl-0">
                  <button
                    className="text-red-400 rounded-md enabled:hover:bg-red-100/40 size-full aspect-square grid place-items-center p-2 transition-colors mr-0 ml-auto disabled:opacity-50 disabled:!cursor-default"
                    type="button"
                    disabled={payments.length === 1}
                    onClick={() => removePayment(idx)}
                  >
                    <TrashIcon size={16} weight="bold" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
