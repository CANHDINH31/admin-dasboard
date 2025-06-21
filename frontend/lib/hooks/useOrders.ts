import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ordersApi,
  CreateOrderDto,
  UpdateOrderDto,
  Order,
  OrdersResponse,
} from "../api/orders";
import { toast } from "sonner";

// Query keys
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// Hook to get all orders
export const useOrders = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => ordersApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

// Hook to get order by ID
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderDto) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success("Đơn hàng đã được tạo thành công");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Không thể tạo đơn hàng";
      toast.error(message);
    },
  });
};

// Hook to update order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) =>
      ordersApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      toast.success("Đơn hàng đã được cập nhật thành công");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Không thể cập nhật đơn hàng";
      toast.error(message);
    },
  });
};

// Hook to delete order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ordersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      toast.success("Đơn hàng đã được xóa thành công");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Không thể xóa đơn hàng";
      toast.error(message);
    },
  });
};

// Hook to bulk delete orders
export const useBulkDeleteOrders = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = [];
      for (const id of ids) {
        try {
          const result = await ordersApi.delete(id);
          results.push({ id, success: true, result });
        } catch (error) {
          results.push({ id, success: false, error });
        }
      }
      return results;
    },
    onSuccess: (results, ids) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;
      if (failCount === 0) {
        toast.success(`Đã xóa thành công ${successCount} đơn hàng`);
      } else if (successCount === 0) {
        toast.error(`Không thể xóa ${failCount} đơn hàng`);
      } else {
        toast.success(
          `Đã xóa thành công ${successCount} đơn hàng, ${failCount} đơn hàng thất bại`
        );
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Không thể xóa đơn hàng";
      toast.error(message);
    },
  });
};

// Re-export types for convenience
export type { Order, CreateOrderDto, UpdateOrderDto, OrdersResponse };
