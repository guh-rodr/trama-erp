export interface CategoryForm {
  id?: string;
  name: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  productCount: number;
}

export interface CategoryResponse {
  pageCount: number;
  rowCount: number;
  rows: CategoryRow[];
}
