interface ModelVariant {
  id: string;
  size: string;
  color: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
}

interface ModelVariantForm {
  id?: string;
  size: string;
  color: string;
  costPrice?: number;
  salePrice?: number;
  quantity?: number;
}

export interface ModelForm {
  id?: string;
  name: string;
  category: string; // id ou nome
  costPrice?: number;
  salePrice?: number;
  quantity?: number;
  variants?: ModelVariantForm[];
}

export type ModelItem = {
  id: string;
  name: string;
  categoryId: string;
  itemCount: number;
} & (
  | { isVariable: true; variants: ModelVariant[] }
  | { isVariable: false; costPrice: number; salePrice: number; quantity: number }
);
