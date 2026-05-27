import qs from 'qs';
import { useSearchParams } from 'react-router';

export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParams = qs.parse(searchParams.toString());

  const setQueryParams = (params: unknown) => {
    const query = qs.stringify(params, {
      encodeValuesOnly: true,
      skipNulls: true,
    });

    setSearchParams(query);
  };

  return {
    queryParams,
    setQueryParams,
  };
}
