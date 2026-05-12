import { useCallback, useRef, useState } from 'react';
import { FilterForm, FilterHandle } from '../types/filters';

export const initialFilterForm: FilterForm = {
  filters: [],
  logical: 'AND',
};

export function useFilter() {
  const filterRef = useRef<FilterHandle>(null);
  const [appliedFilter, setAppliedFilter] = useState<FilterForm>(initialFilterForm);

  const applyFilter = useCallback((filter: FilterForm) => setAppliedFilter(filter), []);
  const resetFilter = useCallback(() => filterRef.current?.reset(), []);

  return {
    appliedFilter,
    applyFilter,
    resetFilter,
    filterRef,
  };
}
