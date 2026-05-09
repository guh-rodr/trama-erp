import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { FilterForm } from '../components/Filter/Filter';

export function useFilter(defaultValues?: FilterForm) {
  const { control, setValue, reset } = useForm<FilterForm>({
    defaultValues: defaultValues || {
      logical: 'AND',
      filters: [{ field: '', operator: '', value: undefined }],
    },
  });

  const [appliedFilter, setAppliedFilter] = useState<FilterForm>({
    filters: [],
    logical: 'AND',
  });

  const applyFilter = (newFilter: FilterForm) => setAppliedFilter(newFilter);

  const resetFilter = () => {
    if (appliedFilter.filters.length) {
      reset();
      setAppliedFilter({ logical: 'AND', filters: [] });

      toast('Os filtros aplicados foram removidos', { position: 'top-right' });
    }
  };

  const filterCount = appliedFilter.filters.length;

  return {
    control,
    setValue,
    appliedFilter,
    applyFilter,
    filterCount,
    resetFilter,
  };
}
