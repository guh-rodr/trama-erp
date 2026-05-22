import { Option } from '../components/Autocomplete/Autocomplete';

export type FilterLogicalOp = 'OR' | 'AND';

export interface FilterFieldProps {
  key: string;
  label: string;
  type: 'text' | 'enum' | 'number' | 'date' | 'currency';
  options?: Option[];
}

export interface FilterItem {
  field: string;
  operator: string;
  value?: string | number;
}

export interface FilterForm {
  logical: FilterLogicalOp;
  filters: FilterItem[];
}

export interface FilterHandle {
  reset: () => void;
  update: (filter: FilterForm) => void;
}
