import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isSupabaseConfigured } from '@/shared/services/supabase';
import {
  createTransaction,
  deleteTransaction,
  fetchTransactions,
  getTransactionsSnapshot,
  updateTransaction,
  type TransactionInput,
} from './store';

export const transactionsQueryKey = ['transactions'] as const;

export function useTransactionsQuery() {
  return useQuery({
    queryKey: transactionsQueryKey,
    queryFn: fetchTransactions,
    initialData: isSupabaseConfigured ? undefined : getTransactionsSnapshot,
  });
}

export function useCreateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TransactionInput) => createTransaction(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}

export function useUpdateTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TransactionInput }) => updateTransaction(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}

export function useDeleteTransactionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}
