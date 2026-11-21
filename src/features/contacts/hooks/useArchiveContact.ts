import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contactApi } from '../api/contacts.api';
import { contactKeys } from '../api/contacts.keys';

export function useArchiveContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactApi.archive,
    onSuccess: () => {
      toast.success('Contato arquivado com sucesso!');

      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}
