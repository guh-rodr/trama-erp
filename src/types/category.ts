import { ModelItem } from './model';

export interface CategoryItem {
  id: string;
  name: string;
  models: ModelItem[];
}

export interface CreateCategoryForm {
  name: string;
}

export type EditCategoryForm = Pick<CategoryItem, 'id' | 'name'>;
