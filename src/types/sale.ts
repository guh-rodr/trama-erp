import { CustomerRow } from './customer';

export type SaleStatus = 'PAID' | 'PARTIAL' | 'PENDING';

export interface SaleItem {
  id: string;
  productName: string;
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
  productId: string;
  variantId: string;
  salePrice?: number;
}

export interface SaleInstallment {
  id: string;
  value: number;
  paidAt: string;
}

export interface SaleForm {
  customerId: string;
  paymentTerm: 'CASH' | 'INSTALLMENT' | 'TAB';
  entry?: {
    method: 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';
    value: number;
  };
  receivables: {
    dueDate?: string;
    value?: number;
  }[];
  payments: {
    method?: 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';
    value?: number;
  }[];
  items: SaleItemForm[];
  purchasedAt: string;
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
