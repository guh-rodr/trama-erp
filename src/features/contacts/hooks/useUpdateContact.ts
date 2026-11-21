import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contactApi } from '../api/contacts.api';
import { contactKeys } from '../api/contacts.keys';

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactApi.update,
    onSuccess: () => {
      toast.success('Contato editado com sucesso!');

      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}
