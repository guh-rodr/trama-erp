import z from 'zod';
import { useQueryParams } from './useQueryParams';

const TableParamsSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
});

export type TableParams = z.infer<typeof TableParamsSchema>;

export function useTableParams() {
  const { queryParams, setQueryParams } = useQueryParams();

  const params = TableParamsSchema.safeParse(queryParams).data ?? { page: 1 };

  const setParams = (newParams: Partial<TableParams>) => {
    setQueryParams(newParams);
  };

  return { params, setParams };
}
