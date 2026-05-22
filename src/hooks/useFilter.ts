import { useCallback, useEffect, useRef, useState } from 'react';
import { FilterForm, FilterHandle } from '../types/filters';

export const initialFilterForm: FilterForm = {
  filters: [],
  logical: 'AND',
};

export function useFilter(defaultFilter?: FilterForm) {
  const filterRef = useRef<FilterHandle>(null);
  const hasAppliedFilterRef = useRef(false);

  const [appliedFilter, setAppliedFilter] = useState<FilterForm>(initialFilterForm);

  const applyFilter = useCallback((filter: FilterForm) => setAppliedFilter(filter), []);
  const resetFilter = useCallback(() => filterRef.current?.reset(), []);

  useEffect(() => {
    if (!defaultFilter || hasAppliedFilterRef.current) return;

    filterRef.current?.update(defaultFilter);
    hasAppliedFilterRef.current = true;
  }, [applyFilter, defaultFilter]);

  return {
    appliedFilter,
    applyFilter,
    resetFilter,
    filterRef,
  };
}
