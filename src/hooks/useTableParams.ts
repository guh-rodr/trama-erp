import z from 'zod';
import { FilterForm, useFilter } from './useFilter';
import { useQueryParams } from './useQueryParams';

const TableParamsSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
});

type BaseTableParams = z.infer<typeof TableParamsSchema>;
export type TableParams = BaseTableParams & { filter: FilterForm };

export function useTableParams() {
  const { filter } = useFilter();
  const { queryParams, setQueryParams } = useQueryParams();

  const params = {
    ...(TableParamsSchema.safeParse(queryParams).data ?? { page: 1 }),
    filter,
  };

  const setParams = (newParams: Partial<BaseTableParams>) => {
    setQueryParams(newParams);
  };

  return { params, setParams };
}
