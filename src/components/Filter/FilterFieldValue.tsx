import { FilterFieldProps } from '../../types/filters';
import { Autocomplete } from '../Autocomplete/Autocomplete';
import { CurrencyInput } from '../CurrencyInput';
import { Input } from '../Input';

interface Props {
  field: FilterFieldProps;
  value?: string;
  handleChangeValue: (value: string) => void;
}

export function FilterFieldValue({ field, value, handleChangeValue }: Props) {
  const { type, options } = field;

  if (type === 'enum') {
    return (
      <Autocomplete
        readOnly
        value={value}
        onChangeOption={handleChangeValue}
        className="h-8 min-w-36 w-auto truncate pr-5"
        placeholder="Valor"
        options={options || []}
      />
    );
  }

  if (type === 'text') {
    return (
      <Input
        value={value}
        onChange={(e) => handleChangeValue(e.target.value)}
        className="min-w-38 h-8"
        placeholder="Valor"
      />
    );
  }

  if (type === 'number') {
    return (
      <Input
        value={value}
        onChange={(e) => handleChangeValue(e.target.value)}
        type="number"
        className="min-w-38 h-8"
        placeholder="Valor"
      />
    );
  }

  if (type === 'date') {
    return (
      <Input
        value={value}
        onChange={(e) => handleChangeValue(e.target.value)}
        type="date"
        className="min-w-38 h-8"
        placeholder="Valor"
      />
    );
  }

  if (type === 'currency') {
    return (
      <CurrencyInput
        placeholder="Valor"
        value={value ? +value : undefined}
        onValueChange={(val) => handleChangeValue(String(val))}
        className="min-w-38 h-8"
      />
    );
  }
}
