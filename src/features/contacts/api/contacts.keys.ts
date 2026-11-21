import type { TableParams } from '@/hooks/useTableParams';

export const contactKeys = {
  all: () => ['contacts'] as const,
  lists: () => [...contactKeys.all(), 'list'] as const,
  list: (params: TableParams) => [...contactKeys.lists(), params] as const,
  details: () => [...contactKeys.all(), 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
};
