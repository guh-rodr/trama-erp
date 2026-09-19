import { SaleStatus } from './sale';

export interface CustomerSaleItem {
  id: string;
  itemCount: number;
  installmentCount: number;
  status: SaleStatus;
  purchasedAt: string;
  total: number;
  totalReceived: number;
  profit: number;
  profitReceived: number;
}

export interface CustomerStatsResponse {
  metrics: {
    totalPaid: number;
    saleCount: number;
    debt: number;
    avgTicket: number;
  };
  preferences: {
    topColor: string | null;
    topSize: string | null;
    topCategory: string | null;
  };
}

export interface CustomerOption {
  id: string;
  name: string;
}
