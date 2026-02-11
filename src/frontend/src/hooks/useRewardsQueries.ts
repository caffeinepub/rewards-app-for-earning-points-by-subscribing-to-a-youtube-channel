import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserProfile, RewardsTask, TaskSubmission, WithdrawalRequest, UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// User Role Queries
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

// Tasks Queries
export function useGetAllTasks() {
  const { actor, isFetching } = useActor();

  return useQuery<RewardsTask[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

// Points Balance Query
export function useGetPointsBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['pointsBalance'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getPointsBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

// Task Submissions Queries
export function useGetTaskSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<TaskSubmission[]>({
    queryKey: ['taskSubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTaskSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taskSubmissions'] });
    },
  });
}

// Withdrawal Requests Queries
export function useGetWithdrawalRequests() {
  const { actor, isFetching } = useActor();

  return useQuery<WithdrawalRequest[]>({
    queryKey: ['withdrawalRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWithdrawalRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateWithdrawalRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createWithdrawalRequest(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['withdrawalRequests'] });
      queryClient.invalidateQueries({ queryKey: ['pointsBalance'] });
    },
  });
}

