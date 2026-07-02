import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured } from '@/shared/services/supabase';
import {
  createBudget,
  deleteBudget,
  fetchBudgets,
  getBudgetsSnapshot,
  updateBudget,
  type BudgetInput,
} from './store';

export const budgetsQueryKey = ['budgets'] as const;

export function useBudgetsQuery() {
  return useQuery({
    queryKey: budgetsQueryKey,
    queryFn: fetchBudgets,
    initialData: isSupabaseConfigured ? undefined : getBudgetsSnapshot,
  });
}

export function useCreateBudgetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BudgetInput) => createBudget(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: budgetsQueryKey }),
  });
}

export function useUpdateBudgetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: BudgetInput }) => updateBudget(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: budgetsQueryKey }),
  });
}

export function useDeleteBudgetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBudget(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: budgetsQueryKey }),
  });
}
