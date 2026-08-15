import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Autocomplete } from '../../../../components/Autocomplete/Autocomplete';
import { CurrencyInput } from '../../../../components/CurrencyInput';
import { Label } from '../../../../components/Label';
import { ToggleSwitch } from '../../../../components/ToggleSwitch';
import { SaleForm } from '../../../../types/sale';

interface Props {
  control: Control<SaleForm>;
  onDisable?: () => void;
  onBlurValue?: () => void;
}

export function PaymentEntryContainer({ control, onDisable, onBlurValue }: Props) {
  const [hasEntry, setHasEntry] = useState(false);

  const handleToggle = () => {
    const hasNowEntry = !hasEntry;

    if (!hasNowEntry) {
      onDisable?.();
    }

    setHasEntry(hasNowEntry);
  };

  const handleBlur = () => {
    onBlurValue?.();
  };

  return (
    <>
      <div className="flex items-center justify-between mt-4">
        <Label className="p-0">Entrada</Label>
        <div>
          <ToggleSwitch isOn={hasEntry} onToggle={handleToggle} />
        </div>
      </div>
      {hasEntry && (
        <div className="space-y-2">
          <div className="flex gap-3 [&>*]:flex-1">
            <Controller
              control={control}
              name="entry.method"
              rules={{ required: true }}
              render={({ field }) => (
                <Autocomplete
                  placeholder="Forma de pagamento"
                  readOnly
                  onChangeOption={field.onChange}
                  options={[
                    { label: 'Dinheiro', value: 'CASH' },
                    { label: 'Pix', value: 'PIX' },
                    { label: 'Cartão de crédito', value: 'CREDIT_CARD' },
                    { label: 'Cartão de débito', value: 'DEBIT_CARD' },
                  ]}
                />
              )}
            />

            <Controller
              name={`entry.value`}
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CurrencyInput
                  {...field}
                  placeholder="Valor da entrada"
                  onValueChange={field.onChange}
                  onBlur={handleBlur}
                />
              )}
            />
          </div>
        </div>
      )}
    </>
  );
}
