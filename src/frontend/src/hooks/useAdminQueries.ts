import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';

interface CreateTaskParams {
  title: string;
  description: string;
  points: bigint;
  url: string;
}

interface VerifyTaskParams {
  submitter: string;
  taskId: bigint;
  approved: boolean;
}

interface ReviewWithdrawalParams {
  user: string;
  requestId: bigint;
  approved: boolean;
}

interface PendingSubmission {
  user: string;
  taskId: bigint;
  status: string;
}

interface WithdrawalRequestAdmin {
  user: string;
  id: bigint;
  amount: bigint;
  status: string;
}

// Task Management
export function useCreateTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, description, points, url }: CreateTaskParams) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTask(title, description, points, url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

// Submissions Review
export function useGetAllPendingSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<PendingSubmission[]>({
    queryKey: ['pendingSubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      // Note: Backend doesn't have a direct method to list all pending submissions
      // This is a placeholder that returns empty array
      // In a real implementation, we'd need a backend method like getAllPendingSubmissions()
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVerifyTaskSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ submitter, taskId, approved }: VerifyTaskParams) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(submitter);
      return actor.verifyTaskSubmission(principal, taskId, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingSubmissions'] });
      queryClient.invalidateQueries({ queryKey: ['taskSubmissions'] });
    },
  });
}

// Withdrawal Requests Review
export function useGetAllWithdrawalRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<WithdrawalRequestAdmin[]>({
    queryKey: ['allWithdrawalRequests'],
    queryFn: async () => {
      if (!actor) return [];
      // Note: Backend doesn't have a direct method to list all withdrawal requests
      // This is a placeholder that returns empty array
      // In a real implementation, we'd need a backend method like getAllWithdrawalRequests()
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useReviewWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, requestId, approved }: ReviewWithdrawalParams) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(user);
      return actor.reviewWithdrawalRequest(principal, requestId, approved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allWithdrawalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawalRequests'] });
    },
  });
}

