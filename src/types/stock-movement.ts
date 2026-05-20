import { ProductItem, ProductVariant } from './product';

type StockMovementType = 'ENTRY' | 'EXIT';
type StockMovementOrigin = 'MANUAL' | 'SALE' | 'PURCHASE';

export interface StockMovementValues {
  variantId: string;
  type: StockMovementType;
  quantity: number;
  unitCost?: number;
  reason?: string;
  date: string;
}

export interface StockMovementFetchParams {
  productId: string;
  variantId: string;
  type: '' | StockMovementType;
}

export interface StockMovementProductItem {
  id: string;
  type: StockMovementType;
  reason?: string;
  date: string;
  quantity: number;
  unitCost?: number;
  origin: StockMovementOrigin;
  variant: Pick<ProductVariant, 'id' | 'color' | 'size'>;
}

export interface StockMovementProductFetch {
  hasMany: boolean;
  items: StockMovementProductItem[];
}

export interface StockMovementRow {
  id: string;
  product: Pick<ProductItem, 'id' | 'name'>;
  variant: Pick<ProductVariant, 'id' | 'color' | 'size'>;
  unitCost?: number;
  type: StockMovementType;
  quantity: number;
  origin: StockMovementOrigin;
  balance: number;
  date: string;
  reason?: string;
}

export interface StockMovementResponse {
  pageCount: number;
  rowCount: number;
  rows: StockMovementRow[];
}
