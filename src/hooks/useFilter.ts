import { useCallback, useEffect, useMemo, useRef } from 'react';
import z from 'zod';
import { useQueryParams } from './useQueryParams';

export const initialFilterForm: FilterForm = {
  filters: [],
  logical: 'AND',
};

const FilterSchema = z.object({
  filters: z.array(
    z.object({
      field: z.string(),
      operator: z.string(),
      value: z.string().or(z.number()).optional(),
    }),
  ),
  logical: z.enum(['AND', 'OR']),
});

export type FilterForm = z.infer<typeof FilterSchema>;

export function useFilter(defaultFilter?: FilterForm) {
  const hasAppliedDefaultRef = useRef(false);

  const { queryParams, setQueryParams } = useQueryParams();
  const filters = queryParams.filters;
  const logical = queryParams.logical;

  const filter: FilterForm = useMemo(
    () => FilterSchema.safeParse({ filters, logical }).data ?? initialFilterForm,
    [filters, logical],
  );

  const setFilter = useCallback(
    (newFilter: FilterForm) => {
      setQueryParams(newFilter.filters.length > 0 ? newFilter : { filters: null, logical: null });
    },
    [setQueryParams],
  );

  const resetFilter = useCallback(() => {
    setFilter(initialFilterForm);
  }, [setFilter]);

  useEffect(() => {
    if (defaultFilter && !hasAppliedDefaultRef.current) {
      setFilter(defaultFilter);
      hasAppliedDefaultRef.current = true;
    }
  }, [defaultFilter, setFilter]);

  return {
    filter,
    setFilter,
    resetFilter,
  };
}
