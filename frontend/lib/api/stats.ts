import { axiosInstance } from "../axios";

export interface DashboardStats {
  userStats: {
    total: number;
    active: number;
    admins: number;
    regular: number;
    newThisMonth: number;
  };
  productStats: {
    total: number;
    totalSiteValue: number;
    totalSellingValue: number;
    newThisMonth: number;
  };
  orderStats: {
    total: number;
    totalRevenue: number;
    totalProfit: number;
    totalQuantity: number;
    recentOrders: number;
    byStatus: Array<{ _id: string; count: number }>;
  };
  accountStats: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    byMarketplace: Array<{ _id: string; count: number }>;
  };
  taskStats: {
    total: number;
    running: number;
    completed: number;
    failed: number;
    pending: number;
    byType: Array<{ _id: string; count: number }>;
  };
  revenueStats: {
    monthlyRevenue: Array<{
      _id: { year: number; month: number };
      revenue: number;
      profit: number;
      orders: number;
    }>;
    topProducts: Array<{
      _id: string;
      totalQuantity: number;
      totalRevenue: number;
      name: string;
    }>;
  };
}

export interface ChartData {
  orderTrends: Array<{
    _id: string;
    orders: number;
    revenue: number;
  }>;
  revenueTrends: Array<{
    _id: string;
    revenue: number;
    profit: number;
  }>;
  taskProgress: Array<{
    _id: string;
    count: number;
    avgProgress: number;
  }>;
}

export const statsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await axiosInstance.get("/stats/dashboard");
    return response.data;
  },

  getChartData: async (): Promise<ChartData> => {
    const response = await axiosInstance.get("/stats/charts");
    return response.data;
  },
};
