import { ArrowsClockwiseIcon, TrashIcon } from '@phosphor-icons/react';
import { Dispatch } from 'react';
import { FilterFieldProps, FilterItem, FilterLogicalOp } from '../../types/filters';
import { FILTER_CONDITIONS } from '../../utils/filterConditions';
import { Autocomplete } from '../Autocomplete/Autocomplete';
import { FilterAction } from './Filter';
import { FilterFieldValue } from './FilterFieldValue';

interface Props {
  index: number;
  filter: FilterItem;
  fields: FilterFieldProps[];
  currentLogical: FilterLogicalOp;
  value: FilterItem['value'];
  dispatch: Dispatch<FilterAction>;
}

const logicalOperatorsMap: Record<FilterLogicalOp, string> = {
  AND: 'e',
  OR: 'ou',
};

export function FilterRow({ index, filter, fields, currentLogical, value, dispatch }: Props) {
  const fieldsOptions = fields.map((f) => ({ label: f.label, value: f.key }));

  const field = fields.find((f) => f.key === filter.field)!;

  const conditions = field?.type ? FILTER_CONDITIONS[field.type] : [];
  const currentCondition = conditions.find((c) => c.key === filter.operator);

  const conditionsOptions = conditions.map((c) => ({
    label: c.label,
    value: c.key,
  }));

  const handleChangeField = (field: string) => {
    dispatch({ type: 'update', index, payload: { field, operator: '', value: '' } });
  };

  const handleChangeOp = (operator: string) => {
    dispatch({ type: 'update', index, payload: { ...filter, operator } });
  };

  const handleChangeValue = (value: string) => {
    dispatch({ type: 'update', index, payload: { ...filter, value } });
  };

  const handleToggleLogical = () => {
    const newLogical = currentLogical === 'AND' ? 'OR' : 'AND';
    dispatch({ type: 'update_logical', logical: newLogical });
  };

  const handleRemoveRow = () => {
    dispatch({ type: 'remove', index });
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="min-w-11 text-center text-neutral-700">
        {index === 0 ? (
          'Onde'
        ) : (
          <button
            type="button"
            onClick={handleToggleLogical}
            className="border border-neutral-200 bg-neutral-100/30 w-full rounded-lg flex gap-1 justify-center items-center p-1 h-8 transition-colors hover:bg-neutral-100"
          >
            {logicalOperatorsMap[currentLogical]}
            <ArrowsClockwiseIcon weight="bold" size={12} color="gray" />
          </button>
        )}
      </span>

      <div className="flex items-center gap-2">
        <Autocomplete
          readOnly
          value={filter.field}
          onChangeOption={handleChangeField}
          className="h-8 min-w-40"
          placeholder="Campo"
          options={fieldsOptions}
        />

        <Autocomplete
          key={filter.field}
          readOnly
          value={filter.operator}
          onChangeOption={handleChangeOp}
          className="h-8 min-w-40"
          placeholder="Condição"
          options={conditionsOptions}
        />

        {field && currentCondition?.hasValue && (
          <FilterFieldValue field={field} value={value as string} handleChangeValue={handleChangeValue} />
        )}
      </div>

      <button
        type="button"
        onClick={handleRemoveRow}
        className="text-red-400 rounded-md hover:bg-red-100/40 p-2 transition-colors mr-0 ml-auto"
      >
        <TrashIcon size={16} weight="bold" />
      </button>
    </div>
  );
}
