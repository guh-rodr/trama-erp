import { CategoryItem } from './category';

interface ModelItemBase {
  name: string;
  costPrice?: number;
  salePrice?: number;
}

export interface ModelItem extends ModelItemBase {
  id: string;
  category: Pick<CategoryItem, 'id' | 'name'>;
  itemCount: number;
}

export interface ModelVariantForm {
  color: string;
  size: string;
  quantity: number;
}

export interface ModelItemForm extends ModelItemBase {
  id?: string;
  variants: ModelVariantForm[];
}

export interface ModelForm {
  category: string; // id ou nome
  model?: ModelItemForm;
}
