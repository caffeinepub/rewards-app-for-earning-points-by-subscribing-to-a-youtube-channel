import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TaskSubmission {
    status: TaskStatus;
    taskId: bigint;
    timestamp: number;
}
export interface WithdrawalRequest {
    id: bigint;
    status: WithdrawalStatus;
    timestamp: number;
    amount: bigint;
}
export interface RewardsTask {
    id: bigint;
    url: string;
    title: string;
    description: string;
    points: bigint;
}
export interface UserProfile {
    name: string;
}
export enum TaskStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTask(title: string, description: string, points: bigint, url: string): Promise<void>;
    createWithdrawalRequest(amount: bigint): Promise<void>;
    getAllTasks(): Promise<Array<RewardsTask>>;
    getAllTasksByTitle(): Promise<Array<RewardsTask>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPointsBalance(): Promise<bigint>;
    getTaskSubmissions(): Promise<Array<TaskSubmission>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWithdrawalRequests(): Promise<Array<WithdrawalRequest>>;
    isCallerAdmin(): Promise<boolean>;
    reviewWithdrawalRequest(user: Principal, requestId: bigint, approved: boolean): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitTask(taskId: bigint): Promise<void>;
    verifyTaskSubmission(submitter: Principal, taskId: bigint, approved: boolean): Promise<void>;
}
