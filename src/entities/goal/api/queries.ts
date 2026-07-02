import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured } from '@/shared/services/supabase';
import {
  createGoal,
  deleteGoal,
  fetchGoals,
  getGoalsSnapshot,
  updateGoal,
  type GoalInput,
} from './store';

export const goalsQueryKey = ['goals'] as const;

export function useGoalsQuery() {
  return useQuery({
    queryKey: goalsQueryKey,
    queryFn: fetchGoals,
    initialData: isSupabaseConfigured ? undefined : getGoalsSnapshot,
  });
}

export function useCreateGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GoalInput) => createGoal(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: goalsQueryKey }),
  });
}

export function useUpdateGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: GoalInput }) => updateGoal(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: goalsQueryKey }),
  });
}

export function useDeleteGoalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGoal(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: goalsQueryKey }),
  });
}
