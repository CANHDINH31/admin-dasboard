import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface DetailedStatsProps {
  stats: {
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
  };
}

const StatusBadge = ({ status, count }: { status: string; count: number }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
      case "running":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle };
      case "pending":
        return { color: "bg-yellow-100 text-yellow-800", icon: Clock };
      case "failed":
      case "suspended":
        return { color: "bg-red-100 text-red-800", icon: XCircle };
      case "inactive":
        return { color: "bg-gray-100 text-gray-800", icon: AlertTriangle };
      default:
        return { color: "bg-blue-100 text-blue-800", icon: Activity };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium">{status}</span>
      </div>
      <Badge variant="secondary">{count}</Badge>
    </div>
  );
};

export const DetailedStats: React.FC<DetailedStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Users Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(stats.userStats.total)}
              </div>
              <div className="text-sm text-blue-600">Total Users</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(stats.userStats.newThisMonth)}
              </div>
              <div className="text-sm text-green-600">New This Month</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Admins</span>
              <span>
                {stats.userStats.admins} (
                {calculatePercentage(
                  stats.userStats.admins,
                  stats.userStats.total
                ).toFixed(1)}
                %)
              </span>
            </div>
            <Progress
              value={calculatePercentage(
                stats.userStats.admins,
                stats.userStats.total
              )}
              className="h-2"
            />

            <div className="flex justify-between text-sm">
              <span>Regular Users</span>
              <span>
                {stats.userStats.regular} (
                {calculatePercentage(
                  stats.userStats.regular,
                  stats.userStats.total
                ).toFixed(1)}
                %)
              </span>
            </div>
            <Progress
              value={calculatePercentage(
                stats.userStats.regular,
                stats.userStats.total
              )}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(stats.productStats.total)}
              </div>
              <div className="text-sm text-purple-600">Total Products</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {formatNumber(stats.productStats.newThisMonth)}
              </div>
              <div className="text-sm text-orange-600">New This Month</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Site Value</span>
              <span>{formatCurrency(stats.productStats.totalSiteValue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Selling Value</span>
              <span>
                {formatCurrency(stats.productStats.totalSellingValue)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Order Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600">
                {formatNumber(stats.orderStats.total)}
              </div>
              <div className="text-sm text-indigo-600">Total Orders</div>
            </div>
            <div className="text-center p-3 bg-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-pink-600">
                {formatNumber(stats.orderStats.recentOrders)}
              </div>
              <div className="text-sm text-pink-600">Recent Orders</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Revenue</span>
              <span>{formatCurrency(stats.orderStats.totalRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Profit</span>
              <span>{formatCurrency(stats.orderStats.totalProfit)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Quantity</span>
              <span>{formatNumber(stats.orderStats.totalQuantity)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Orders by Status</h4>
            {stats.orderStats.byStatus.map((status) => (
              <StatusBadge
                key={status._id}
                status={status._id}
                count={status.count}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accounts Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Account Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">
                {formatNumber(stats.accountStats.total)}
              </div>
              <div className="text-sm text-teal-600">Total Accounts</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {formatNumber(stats.accountStats.active)}
              </div>
              <div className="text-sm text-emerald-600">Active</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Active</span>
              <span>
                {stats.accountStats.active} (
                {calculatePercentage(
                  stats.accountStats.active,
                  stats.accountStats.total
                ).toFixed(1)}
                %)
              </span>
            </div>
            <Progress
              value={calculatePercentage(
                stats.accountStats.active,
                stats.accountStats.total
              )}
              className="h-2"
            />

            <div className="flex justify-between text-sm">
              <span>Inactive</span>
              <span>
                {stats.accountStats.inactive} (
                {calculatePercentage(
                  stats.accountStats.inactive,
                  stats.accountStats.total
                ).toFixed(1)}
                %)
              </span>
            </div>
            <Progress
              value={calculatePercentage(
                stats.accountStats.inactive,
                stats.accountStats.total
              )}
              className="h-2"
            />

            <div className="flex justify-between text-sm">
              <span>Suspended</span>
              <span>
                {stats.accountStats.suspended} (
                {calculatePercentage(
                  stats.accountStats.suspended,
                  stats.accountStats.total
                ).toFixed(1)}
                %)
              </span>
            </div>
            <Progress
              value={calculatePercentage(
                stats.accountStats.suspended,
                stats.accountStats.total
              )}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tasks Stats */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Task Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(stats.taskStats.total)}
              </div>
              <div className="text-sm text-blue-600">Total Tasks</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(stats.taskStats.running)}
              </div>
              <div className="text-sm text-green-600">Running</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(stats.taskStats.completed)}
              </div>
              <div className="text-sm text-purple-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {formatNumber(stats.taskStats.failed)}
              </div>
              <div className="text-sm text-red-600">Failed</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Tasks by Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <StatusBadge status="Running" count={stats.taskStats.running} />
              <StatusBadge
                status="Completed"
                count={stats.taskStats.completed}
              />
              <StatusBadge status="Failed" count={stats.taskStats.failed} />
              <StatusBadge status="Pending" count={stats.taskStats.pending} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
