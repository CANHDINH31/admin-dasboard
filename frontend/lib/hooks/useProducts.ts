import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  productsApi,
  CreateProductRequest,
  UpdateProductRequest,
  Product,
  ProductsResponse,
} from "../api/products";
import { toast } from "sonner";

// Query keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Hook to get all products
export const useProducts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productsApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

// Hook to get product by ID
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Sản phẩm đã được tạo thành công");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Không thể tạo sản phẩm";
      toast.error(message);
    },
  });
};

// Hook to update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productsApi.updateProduct(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
      toast.success("Sản phẩm đã được cập nhật thành công");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Không thể cập nhật sản phẩm";
      toast.error(message);
    },
  });
};

// Hook to delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success("Sản phẩm đã được xóa thành công");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Không thể xóa sản phẩm";
      toast.error(message);
    },
  });
};

// Hook to bulk delete products
export const useBulkDeleteProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = [];
      for (const id of ids) {
        try {
          const result = await productsApi.deleteProduct(id);
          results.push({ id, success: true, result });
        } catch (error) {
          results.push({ id, success: false, error });
        }
      }
      return results;
    },
    onSuccess: (results, ids) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;
      if (failCount === 0) {
        toast.success(`Đã xóa thành công ${successCount} sản phẩm`);
      } else if (successCount === 0) {
        toast.error(`Không thể xóa ${failCount} sản phẩm`);
      } else {
        toast.success(
          `Đã xóa thành công ${successCount} sản phẩm, ${failCount} sản phẩm thất bại`
        );
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Không thể xóa sản phẩm";
      toast.error(message);
    },
  });
};

// Re-export types for convenience
export type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductsResponse,
};
