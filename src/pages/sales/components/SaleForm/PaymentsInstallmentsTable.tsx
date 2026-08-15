import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { CurrencyInput } from '../../../../components/CurrencyInput';
import { Input } from '../../../../components/Input';
import { SaleForm } from '../../../../types/sale';
import { PaymentEntryContainer } from './PaymentEntryContainer';

interface Props {
  reorderReceveibles?: (installmentCount: number, entry?: number) => void;
}

export function PaymentsInstallmentsTable({ reorderReceveibles }: Props) {
  const { control } = useFormContext<SaleForm>();
  const receivables = useWatch({ control, name: 'receivables' });

  const onDisableEntry = () => {
    control.unregister('entry');
    // reorderReceveibles?.(receivables.length, 0);
    reorderReceveibles?.(receivables.length);
  };

  const onBlurEntryValue = () => {
    reorderReceveibles?.(receivables.length);
  };

  return (
    <>
      <table className="rounded-xl text-left bg-white shadow-sm w-full">
        <thead>
          <tr className="text-neutral-800 uppercase text-xs *:p-3">
            <th>N.</th>
            <th>Data</th>
            <th>Valor</th>
          </tr>
        </thead>

        <tbody className="relative">
          {receivables?.map((_, idx) => {
            return (
              <tr key={idx} className={`border-y border-neutral-200 text-sm relative *:p-2`}>
                <td className="!pl-4 min-w-16">{idx + 1}</td>

                <td>
                  <Controller
                    name={`receivables.${idx}.dueDate`}
                    control={control}
                    render={({ field }) => <Input {...field} type="date" className="h-9" />}
                  />
                </td>

                <td>
                  <Controller
                    name={`receivables.${idx}.value`}
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput {...field} placeholder="Valor" className="h-9" onValueChange={field.onChange} />
                    )}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <PaymentEntryContainer control={control} onDisable={onDisableEntry} onBlurValue={onBlurEntryValue} />
    </>
  );
}
