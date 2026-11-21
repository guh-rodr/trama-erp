import type { ContactForm } from '@/features/contacts/types/contacts.types';
import type { TableParams } from '@/hooks/useTableParams';
import { api } from '@/lib/api';

const API_PATH = '/contacts';

export const contactApi = {
  async list({ filter, ...params }: TableParams) {
    const response = await api.post(`${API_PATH}/list`, filter, { params });
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`${API_PATH}/${id}`);
    return response.data;
  },

  async create(data: ContactForm) {
    const response = await api.post(API_PATH, data);
    return response.data;
  },

  async update(data: ContactForm) {
    const { id, ...contact } = data;

    const response = await api.patch(`${API_PATH}/${id}`, contact);
    return response.data;
  },

  async delete({ id }: { id: string }) {
    const response = await api.delete(`${API_PATH}/${id}`);
    return response.data;
  },

  async archive({ id }: { id: string }) {
    const response = await api.post(`${API_PATH}/${id}/archive`);
    return response.data;
  },

  async unarchive({ id }: { id: string }) {
    const response = await api.post(`${API_PATH}/${id}/unarchive`);
    return response.data;
  },
};
