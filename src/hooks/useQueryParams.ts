import { useSearchParams } from 'react-router';

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = Object.fromEntries(searchParams.entries());

  const setQueryParams = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, String(value));
      }
    });

    setSearchParams(newSearchParams);
  };

  return {
    queryParams,
    setQueryParams,
  };
}
