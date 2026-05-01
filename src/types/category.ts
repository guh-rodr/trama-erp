import { ProductItem } from './product';

export interface CategoryItem {
  id: string;
  name: string;
  products: ProductItem[];
}

export interface CreateCategoryForm {
  name: string;
}

export type EditCategoryForm = Pick<CategoryItem, 'id' | 'name'>;
