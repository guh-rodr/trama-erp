import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contactApi } from '../api/contacts.api';
import { contactKeys } from '../api/contacts.keys';

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactApi.create,
    onSuccess: () => {
      toast.success('Contato criado com sucesso!');

      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}
