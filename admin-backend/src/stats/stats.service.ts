import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Product } from '../products/schemas/product.schema';
import { Order } from '../orders/schemas/order.schema';
import { Account } from '../accounts/schemas/account.schema';
import { Task } from '../tasks/schemas/task.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Account.name) private readonly accountModel: Model<Account>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async getDashboardStats() {
    const [
      userStats,
      productStats,
      orderStats,
      accountStats,
      taskStats,
      revenueStats,
    ] = await Promise.all([
      this.getUserStats(),
      this.getProductStats(),
      this.getOrderStats(),
      this.getAccountStats(),
      this.getTaskStats(),
      this.getRevenueStats(),
    ]);

    return {
      userStats,
      productStats,
      orderStats,
      accountStats,
      taskStats,
      revenueStats,
    };
  }

  private async getUserStats() {
    const totalUsers = await this.userModel.countDocuments({
      role: { $ne: 'super_admin' },
    });
    const activeUsers = await this.userModel.countDocuments({
      role: { $ne: 'super_admin' },
    });
    const adminUsers = await this.userModel.countDocuments({ role: 'admin' });
    const regularUsers = await this.userModel.countDocuments({ role: 'user' });

    // Users created in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await this.userModel.countDocuments({
      role: { $ne: 'super_admin' },
      createdAt: { $gte: thirtyDaysAgo },
    });

    return {
      total: totalUsers,
      active: activeUsers,
      admins: adminUsers,
      regular: regularUsers,
      newThisMonth: newUsers,
    };
  }

  private async getProductStats() {
    const totalProducts = await this.productModel.countDocuments();
    const totalValue = await this.productModel.aggregate([
      {
        $group: {
          _id: null,
          totalSiteValue: { $sum: '$sitePrice' },
          totalSellingValue: { $sum: '$sellingPrice' },
        },
      },
    ]);

    // Products added in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newProducts = await this.productModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    return {
      total: totalProducts,
      totalSiteValue: totalValue[0]?.totalSiteValue || 0,
      totalSellingValue: totalValue[0]?.totalSellingValue || 0,
      newThisMonth: newProducts,
    };
  }

  private async getOrderStats() {
    const totalOrders = await this.orderModel.countDocuments();
    const totalRevenue = await this.orderModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$sellingPrice' },
          totalProfit: { $sum: '$netProfit' },
          totalQuantity: { $sum: '$quantity' },
        },
      },
    ]);

    // Orders in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentOrders = await this.orderModel.countDocuments({
      orderDate: { $gte: thirtyDaysAgo },
    });

    // Orders by status
    const ordersByStatus = await this.orderModel.aggregate([
      {
        $group: {
          _id: '$trackingStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      total: totalOrders,
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      totalProfit: totalRevenue[0]?.totalProfit || 0,
      totalQuantity: totalRevenue[0]?.totalQuantity || 0,
      recentOrders,
      byStatus: ordersByStatus,
    };
  }

  private async getAccountStats() {
    const totalAccounts = await this.accountModel.countDocuments();
    const activeAccounts = await this.accountModel.countDocuments({
      status: 'active',
    });
    const inactiveAccounts = await this.accountModel.countDocuments({
      status: 'inactive',
    });
    const suspendedAccounts = await this.accountModel.countDocuments({
      status: 'suspended',
    });

    // Accounts by marketplace
    const accountsByMarketplace = await this.accountModel.aggregate([
      {
        $group: {
          _id: '$marketplace',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      total: totalAccounts,
      active: activeAccounts,
      inactive: inactiveAccounts,
      suspended: suspendedAccounts,
      byMarketplace: accountsByMarketplace,
    };
  }

  private async getTaskStats() {
    const totalTasks = await this.taskModel.countDocuments();
    const runningTasks = await this.taskModel.countDocuments({
      status: 'Running',
    });
    const completedTasks = await this.taskModel.countDocuments({
      status: 'Completed',
    });
    const failedTasks = await this.taskModel.countDocuments({
      status: 'Failed',
    });
    const pendingTasks = await this.taskModel.countDocuments({
      status: 'Pending',
    });

    // Tasks by type
    const tasksByType = await this.taskModel.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      total: totalTasks,
      running: runningTasks,
      completed: completedTasks,
      failed: failedTasks,
      pending: pendingTasks,
      byType: tasksByType,
    };
  }

  private async getRevenueStats() {
    // Revenue by month for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await this.orderModel.aggregate([
      {
        $match: {
          orderDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
          },
          revenue: { $sum: '$sellingPrice' },
          profit: { $sum: '$netProfit' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Top selling products
    const topProducts = await this.orderModel.aggregate([
      {
        $group: {
          _id: '$sku',
          totalQuantity: { $sum: '$quantity' },
          totalRevenue: { $sum: '$sellingPrice' },
          name: { $first: '$name' },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return {
      monthlyRevenue,
      topProducts,
    };
  }

  async getChartData() {
    const [orderTrends, revenueTrends, taskProgress] = await Promise.all([
      this.getOrderTrends(),
      this.getRevenueTrends(),
      this.getTaskProgress(),
    ]);

    return {
      orderTrends,
      revenueTrends,
      taskProgress,
    };
  }

  private async getOrderTrends() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await this.orderModel.aggregate([
      {
        $match: {
          orderDate: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$orderDate' },
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$sellingPrice' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  private async getRevenueTrends() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await this.orderModel.aggregate([
      {
        $match: {
          orderDate: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$orderDate' },
          },
          revenue: { $sum: '$sellingPrice' },
          profit: { $sum: '$netProfit' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  private async getTaskProgress() {
    return await this.taskModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          avgProgress: { $avg: '$progress' },
        },
      },
    ]);
  }
}
