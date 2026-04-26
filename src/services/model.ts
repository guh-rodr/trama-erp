import { api } from '../lib/api';
import { ModelForm } from '../types/model';

const API_PATH = '/models';

interface CreateMutationProps extends ModelForm {
  isCategoryCreation?: boolean;
}

export async function createModel({ category, ...data }: CreateMutationProps) {
  const response = await api.post(API_PATH, { categoryId: category, ...data });
  return response.data;
}

export async function fetchModelVariants(id: string) {
  const response = await api.get(`${API_PATH}/${id}/variants`);
  return response.data;
}

export async function editModel(data: ModelForm) {
  const { id, ...body } = data;

  const response = await api({
    method: 'PATCH',
    url: `${API_PATH}/${id}`,
    data: body,
  });
  return response.data;
}

export async function deleteModel(id: string) {
  const response = await api.delete(`${API_PATH}/${id}`);
  return response.data;
}
