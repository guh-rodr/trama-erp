import { TableParams } from '../hooks/useTableParams';
import { api } from '../lib/api';
import { ContactForm } from '../types/contact';

const API_PATH = '/contacts';

export async function fetchContacts({ filter, ...params }: TableParams) {
  const response = await api.post(`${API_PATH}/list`, filter, { params });
  return response.data;
}

export async function fetchContact(id: string) {
  const response = await api.get(`${API_PATH}/${id}`);
  return response.data;
}

export async function createContact(data: ContactForm) {
  const response = await api.post(API_PATH, data);
  return response.data;
}

export async function updateContact(data: ContactForm) {
  const { id, ...contact } = data;

  const response = await api.patch(`${API_PATH}/${id}`, contact);
  return response.data;
}

export async function deleteContact({ id }: { id: string }) {
  const response = await api.delete(`${API_PATH}/${id}`);
  return response.data;
}

export async function archiveContact({ id }: { id: string }) {
  const response = await api.post(`${API_PATH}/${id}/archive`);
  return response.data;
}

export async function unarchiveContact({ id }: { id: string }) {
  const response = await api.post(`${API_PATH}/${id}/unarchive`);
  return response.data;
}
