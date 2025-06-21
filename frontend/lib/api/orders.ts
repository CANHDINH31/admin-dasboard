import { axiosInstance } from "../axios";

export interface Order {
  _id: string;
  trackingStatus: string;
  orderNumEmail: string;
  poNumber: string;
  orderNumber: string;
  orderDate: Date;
  shipBy: Date;
  customerShippingAddress: string;
  quantity: number;
  sku: string;
  sellingPrice: number;
  sourcingPrice: number;
  walmartFee?: number;
  netProfit?: number;
  roi?: number;
  commission?: number;
  upc?: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateOrderDto {
  trackingStatus: string;
  orderNumEmail: string;
  poNumber: string;
  orderNumber: string;
  orderDate: Date;
  shipBy: Date;
  customerShippingAddress: string;
  quantity: number;
  sku: string;
  sellingPrice: number;
  sourcingPrice: number;
  walmartFee?: number;
  netProfit?: number;
  roi?: number;
  commission?: number;
  upc?: string;
  name?: string;
}

export interface UpdateOrderDto extends Partial<CreateOrderDto> {}

export interface OrdersResponse {
  data: Order[];
  meta: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
}

export const ordersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    axiosInstance.get<OrdersResponse>("/orders", { params }),
  getById: (id: string) => axiosInstance.get<Order>(`/orders/${id}`),
  create: (data: CreateOrderDto) => axiosInstance.post<Order>("/orders", data),
  update: (id: string, data: UpdateOrderDto) =>
    axiosInstance.patch<Order>(`/orders/${id}`, data),
  delete: (id: string) => axiosInstance.delete(`/orders/${id}`),
};
