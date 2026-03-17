import { CategoryItem } from './category';

interface ModelItemBase {
  name: string;
  isVariable: boolean;
  costPrice?: number;
  salePrice?: number;
  quantity?: number;
  variants: ModelVariantForm[];
}

export interface ModelItem extends ModelItemBase {
  id: string;
  category: Pick<CategoryItem, 'id' | 'name'>;
  itemCount: number;
}

export interface ModelVariantForm {
  color: string;
  size: string;
  quantity?: number;
  costPrice?: number;
  salePrice?: number;
}

export interface ModelItemForm extends ModelItemBase {
  id?: string;
  variants: ModelVariantForm[];
}

export interface ModelForm extends ModelItemForm {
  category: string; // id ou nome
}
