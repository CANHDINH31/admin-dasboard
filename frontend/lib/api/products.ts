import { axiosInstance } from "../axios";

export interface Product {
  _id: string;
  sku: string;
  upc: string;
  wmid: string;
  name: string;
  sitePrice: number;
  sellingPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateProductRequest {
  sku: string;
  upc: string;
  wmid: string;
  name: string;
  sitePrice: number;
  sellingPrice: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
}

export const productsApi = {
  getProducts: (params?: { page?: number; limit?: number; search?: string }) =>
    axiosInstance.get<ProductsResponse>("/products", { params }),

  getProductById: (id: string) => axiosInstance.get<Product>(`/products/${id}`),

  createProduct: (data: CreateProductRequest) =>
    axiosInstance.post<Product>("/products", data),

  updateProduct: (id: string, data: UpdateProductRequest) =>
    axiosInstance.put<Product>(`/products/${id}`, data),

  deleteProduct: (id: string) => axiosInstance.delete(`/products/${id}`),
};
