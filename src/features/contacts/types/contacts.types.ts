export type ContactType = 'CUSTOMER' | 'SUPPLIER';

export interface ContactForm {
  id?: string;
  name: string;
  type: ContactType;
  phone?: string;
  note?: string;
  document?: string;
}

export interface ContactRow {
  id: string;
  name: string;
  type: ContactType;
  deletedAt: string | null;
  hasFinancialLog: boolean;
}

export interface ContactResponse {
  pageCount: number;
  rowCount: number;
  rows: ContactRow[];
}
