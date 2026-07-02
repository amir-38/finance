export interface Budget {
  id: string;
  categoryId: string | null;
  limit: number;
  month: string;
}
