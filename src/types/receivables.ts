type ReceivableStatus = 'PAID' | 'PARTIAL' | 'PENDING' | 'CANCELLED';
type PaymentMethod = 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';

export interface CustomerReceivable {
  id: string;
  type: 'IMMEDIATE' | 'INSTALLMENT' | 'TAB';
  total: number;
  paid: number;
  installmentIdx?: number;
  installmentCount?: number;
  dueAt?: string;
  createdAt: string;
  description: string;
}

export interface AccountPaymentForm {
  method: PaymentMethod;
  value: number;
}

export interface ReceivablePayment {
  id: string;
  method: PaymentMethod;
  total: number;
  createdAt: string;
}

export interface ReceivableForm {
  id?: string;
  customerId: string;
  customerName: string;
  occurredAt: string;
  dueAt: string;
  total: number;
  description: string;
}

export interface ReceivableReverseForm {
  date: string;
  reason: string;
  allocations: string[];
}

export interface ReceivableRow {
  id: string;
  customerId?: string;
  customerName?: string;
  hasFinancialLog: boolean;
  status: ReceivableStatus;
  saleId: string | null;
  description: string;
  total: number;
  paid: number;
  occurredAt: string;
  dueAt: string;
}

export interface ReceivableResponse {
  pageCount: number;
  rowCount: number;
  rows: ReceivableRow[];
}
