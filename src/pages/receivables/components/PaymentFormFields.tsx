import { Control, Controller } from 'react-hook-form';
import { Autocomplete } from '../../../components/Autocomplete/Autocomplete';
import { CurrencyInput } from '../../../components/CurrencyInput';
import { Label } from '../../../components/Label';
import { convertToCents } from '../../../functions/currency';
import { AccountPaymentForm } from '../../../types/receivables';

interface Props {
  control: Control<AccountPaymentForm>;
  sum: number;
}

export function PaymentFormFields({ control, sum }: Props) {
  return (
    <div className="flex gap-2 *:flex-1">
      <div>
        <Label>Forma de pagamento</Label>
        <Controller
          control={control}
          name="method"
          rules={{ required: true }}
          render={({ field }) => (
            <Autocomplete
              value={field.value}
              onChangeOption={field.onChange}
              placeholder="Forma de pagamento"
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
      </div>

      <div>
        <Label>Valor</Label>
        <Controller
          control={control}
          name="value"
          rules={{ required: true, validate: (v) => convertToCents(v) <= sum || 'Valor maior que o total' }}
          render={({ field }) => (
            <CurrencyInput value={field.value} onValueChange={field.onChange} placeholder="Valor" />
          )}
        />
      </div>
    </div>
  );
}
