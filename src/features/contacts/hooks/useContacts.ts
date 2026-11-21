import { useTableParams } from '@/hooks/useTableParams';
import { useQuery } from '@tanstack/react-query';
import { contactApi } from '../api/contacts.api';
import { contactKeys } from '../api/contacts.keys';
import type { ContactResponse } from '../types/contacts.types';

export function useContacts() {
  const { params } = useTableParams();

  return useQuery<ContactResponse>({
    queryKey: contactKeys.list(params),
    queryFn: () => contactApi.list(params),
  });
}
