import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  accountsApi,
  CreateAccountRequest,
  UpdateAccountRequest,
  Account,
  AccountsResponse,
} from "../api/accounts";
import { toast } from "sonner";

// Query keys
export const accountKeys = {
  all: ["accounts"] as const,
  lists: () => [...accountKeys.all, "list"] as const,
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    [...accountKeys.lists(), params] as const,
  details: () => [...accountKeys.all, "detail"] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
};

// Hook to get all accounts
export const useAccounts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: accountKeys.list(params),
    queryFn: () => accountsApi.getAccounts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

// Hook to get account by ID
export const useAccount = (id: string) => {
  return useQuery({
    queryKey: accountKeys.detail(id),
    queryFn: () => accountsApi.getAccountById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to create account
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountRequest) => accountsApi.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      toast.success("Account created successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to create account";
      toast.error(message);
    },
  });
};

// Hook to update account
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      accountsApi.updateAccount(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      queryClient.invalidateQueries({ queryKey: accountKeys.detail(id) });
      toast.success("Account updated successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to update account";
      toast.error(message);
    },
  });
};

// Hook to delete account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountsApi.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      toast.success("Account deleted successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete account";
      toast.error(message);
    },
  });
};

// Hook to bulk delete accounts
export const useBulkDeleteAccounts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = [];
      for (const id of ids) {
        try {
          const result = await accountsApi.deleteAccount(id);
          results.push({ id, success: true, result });
        } catch (error) {
          results.push({ id, success: false, error });
        }
      }
      return results;
    },
    onSuccess: (results, ids) => {
      queryClient.invalidateQueries({ queryKey: accountKeys.lists() });
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;
      if (failCount === 0) {
        toast.success(`Đã xóa thành công ${successCount} account`);
      } else if (successCount === 0) {
        toast.error(`Không thể xóa ${failCount} account`);
      } else {
        toast.success(
          `Đã xóa thành công ${successCount} account, ${failCount} account thất bại`
        );
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Failed to delete accounts";
      toast.error(message);
    },
  });
};

// Re-export types for convenience
export type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  AccountsResponse,
};
