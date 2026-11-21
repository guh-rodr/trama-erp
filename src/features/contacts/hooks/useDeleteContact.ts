import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { contactApi } from '../api/contacts.api';
import { contactKeys } from '../api/contacts.keys';

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contactApi.delete,
    onSuccess: () => {
      toast.success('Contato excluído com sucesso!');

      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}
