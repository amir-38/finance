type TransactionRow = {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  title: string;
  description: string | null;
  amount: number;
  category_id: string;
  date: string;
  comment: string | null;
  created_at: string;
  updated_at: string;
};

type BudgetRow = {
  id: string;
  user_id: string;
  category_id: string | null;
  limit_amount: number;
  month: string;
  created_at: string;
};

type GoalRow = {
  id: string;
  user_id: string;
  title: string;
  icon: string;
  color: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  created_at: string;
};

type CategoryRow = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  created_at: string;
};

type TableDef<Row, Insert> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      transactions: TableDef<TransactionRow, Omit<TransactionRow, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string; user_id?: string }>;
      budgets: TableDef<BudgetRow, Omit<BudgetRow, 'id' | 'user_id' | 'created_at'> & { id?: string; user_id?: string }>;
      goals: TableDef<GoalRow, Omit<GoalRow, 'id' | 'user_id' | 'created_at'> & { id?: string; user_id?: string }>;
      categories: TableDef<CategoryRow, Omit<CategoryRow, 'id' | 'user_id' | 'created_at'> & { id?: string; user_id?: string }>;
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
  };
};
