import { useQueryParams } from './useQueryParams';

export interface TableParams {
  page: number;
  search: string;
  sortBy: string | null;
  sortDir: string | null;
}

export function useTableParams() {
  const { queryParams, setQueryParams } = useQueryParams();

  const params: TableParams = {
    page: Number(queryParams.page || 1),
    search: queryParams.search || '',
    sortBy: queryParams.sortBy || null,
    sortDir: queryParams.sortDir || null,
  };

  const setParams = (updates: Partial<TableParams>) => {
    setQueryParams(updates);
  };

  return { params, setParams };
}
