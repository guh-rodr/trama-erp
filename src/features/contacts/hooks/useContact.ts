import type { ContactForm } from '@/features/contacts/types/contacts.types';
import { useQuery } from '@tanstack/react-query';
import { contactApi } from '../api/contacts.api';
import { contactKeys } from '../api/contacts.keys';

export function useContact({ id }: { id: string }) {
  return useQuery<ContactForm>({
    queryKey: contactKeys.detail(id),
    queryFn: () => contactApi.getById(id),
    enabled: !!id,
  });
}
