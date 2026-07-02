export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  description?: string;
  amount: number;
  categoryId: string;
  date: string;
  comment?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
