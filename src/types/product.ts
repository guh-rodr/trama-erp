import { CategoryItem } from './category';

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  hasSales: boolean;
  costPrice: number;
  salePrice: number;
  quantity: number;
}

export interface ProductVariantForm {
  id?: string;
  size: string;
  color: string;
  status?: 'idle' | 'added' | 'modified' | 'removed';
  costPrice?: number;
  salePrice?: number;
  quantity?: number;
}

type ProductType = 'simple' | 'variable';

export interface ProductForm {
  id?: string;
  name: string;
  type: ProductType;
  category: string; // id ou nome
  costPrice?: number;
  salePrice?: number;
  quantity?: number;
  variants?: ProductVariantForm[];
}

export type ProductItem = {
  id: string;
  name: string;
  categoryId: string;
  itemCount: number;
} & (
  | { isVariable: true; variants: ProductVariant[] }
  | { isVariable: false; costPrice: number; salePrice: number; quantity: number }
);

export interface ProductRow {
  id: string;
  name: string;
  category: Pick<CategoryItem, 'id' | 'name'>;
  isVariable: boolean;
  variantCount: number;
  quantity: number;
  minSalePrice: number;
  maxSalePrice: number;
}

export interface ProductResponse {
  pageCount: number;
  rowCount: number;
  rows: ProductRow[];
}
