import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  usersApi,
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UsersResponse,
} from "../api/users";
import { toast } from "sonner";

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook to get all users
export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // Sử dụng dữ liệu cũ làm placeholder
  });
};

// Hook to get user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create user";
      toast.error(message);
    },
  });
};

// Hook to update user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch users list and specific user
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update user";
      toast.error(message);
    },
  });
};

// Hook to delete user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete user";
      toast.error(message);
    },
  });
};

// Hook to bulk delete users
export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Xóa từng user một cách tuần tự
      const results = [];
      for (const id of ids) {
        try {
          const result = await usersApi.deleteUser(id);
          results.push({ id, success: true, result });
        } catch (error) {
          results.push({ id, success: false, error });
        }
      }
      return results;
    },
    onSuccess: (results, ids) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;

      if (failCount === 0) {
        toast.success(`Đã xóa thành công ${successCount} user`);
      } else if (successCount === 0) {
        toast.error(`Không thể xóa ${failCount} user`);
      } else {
        toast.success(
          `Đã xóa thành công ${successCount} user, ${failCount} user thất bại`
        );
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to delete users";
      toast.error(message);
    },
  });
};

// Re-export types for convenience
export type { User, CreateUserRequest, UpdateUserRequest, UsersResponse };
