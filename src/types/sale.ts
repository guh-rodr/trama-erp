import { CustomerRow } from './customer';

export type SaleStatus = 'paid' | 'pending';

export interface SaleItem {
  id: string;
  modelName: string;
  categoryName: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
  variant: {
    color: string | null;
    size: string | null;
  };
}

interface SaleItemForm {
  modelId: string;
  variantId: string;
  salePrice?: number;
}

export interface SaleInstallment {
  id: string;
  value: number;
  paidAt: string;
}

export interface SaleInstallmentForm {
  value: number;
  paidAt: string;
}

export interface SaleForm {
  customerId: string;
  items: SaleItemForm[];
  purchasedAt: string;
  installment?: SaleInstallmentForm;
}

export interface SaleOverview {
  status: SaleStatus;
  purchasedAt: string;
  total: number;
  totalReceived: number;
  profit: number;
  profitReceived: number;
  customer: Pick<CustomerRow, 'id' | 'name'>;
}

export interface SaleRow {
  id: string;
  purchasedAt: string;
  createdAt: string;
  total: number;
  profit: number;
  itemCount: number;
  status: SaleStatus;
  customer: Pick<CustomerRow, 'id' | 'name'>;
}

export interface SaleResponse {
  pageCount: number;
  rowCount: number;
  rows: SaleRow[];
}
