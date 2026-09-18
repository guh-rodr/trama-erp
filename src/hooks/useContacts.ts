import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  archiveContact,
  createContact,
  deleteContact,
  fetchContact,
  fetchContacts,
  unarchiveContact,
  updateContact,
} from '../services/contact';
import { ContactForm, ContactResponse } from '../types/contact';
import { TableParams, useTableParams } from './useTableParams';

const contactKeys = {
  all: () => ['contacts'] as const,
  lists: () => [...contactKeys.all(), 'list'] as const,
  list: (params: TableParams) => [...contactKeys.lists(), params] as const,
  details: () => [...contactKeys.all(), 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
};

export function useContacts() {
  const { params } = useTableParams();

  return useQuery<ContactResponse>({
    queryKey: contactKeys.list(params),
    queryFn: () => fetchContacts(params),
  });
}

export function useContact({ id }: { id: string }) {
  return useQuery<ContactForm>({
    queryKey: contactKeys.detail(id),
    queryFn: () => fetchContact(id),
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      toast.success('Contato criado com sucesso!');

      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContact,
    onSuccess: () => {
      toast.success('Contato editado com sucesso!');

      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      toast.success('Contato excluído com sucesso!');

      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}

export function useArchiveContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveContact,
    onSuccess: () => {
      toast.success('Contato arquivado com sucesso!');

      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}

export function useUnarchiveContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unarchiveContact,
    onSuccess: () => {
      toast.success('Contato desarquivado com sucesso!');

      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}
