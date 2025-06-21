import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Activity,
  DollarSign,
  BarChart3,
} from "lucide-react";

interface DashboardStatsProps {
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
    };
    accountStats: {
      total: number;
      active: number;
      inactive: number;
      suspended: number;
    };
    taskStats: {
      total: number;
      running: number;
      completed: number;
      failed: number;
      pending: number;
    };
  };
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  trend?: { value: number; isPositive: boolean };
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {trend && (
        <div
          className={`text-xs ${
            trend.isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend.isPositive ? "+" : ""}
          {trend.value}% from last month
        </div>
      )}
    </CardContent>
  </Card>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={formatNumber(stats.userStats.total)}
        icon={Users}
        description={`${stats.userStats.admins} admins, ${stats.userStats.regular} regular`}
        trend={{ value: 12, isPositive: true }}
      />

      <StatCard
        title="Total Products"
        value={formatNumber(stats.productStats.total)}
        icon={Package}
        description={`${formatCurrency(
          stats.productStats.totalSellingValue
        )} total value`}
        trend={{ value: 8, isPositive: true }}
      />

      <StatCard
        title="Total Orders"
        value={formatNumber(stats.orderStats.total)}
        icon={ShoppingCart}
        description={`${formatCurrency(stats.orderStats.totalRevenue)} revenue`}
        trend={{ value: 15, isPositive: true }}
      />

      <StatCard
        title="Total Revenue"
        value={formatCurrency(stats.orderStats.totalRevenue)}
        icon={DollarSign}
        description={`${formatCurrency(stats.orderStats.totalProfit)} profit`}
        trend={{ value: 20, isPositive: true }}
      />

      <StatCard
        title="Active Accounts"
        value={formatNumber(stats.accountStats.active)}
        icon={CreditCard}
        description={`${stats.accountStats.total} total accounts`}
        trend={{ value: 5, isPositive: true }}
      />

      <StatCard
        title="Running Tasks"
        value={formatNumber(stats.taskStats.running)}
        icon={Activity}
        description={`${stats.taskStats.total} total tasks`}
        trend={{ value: 3, isPositive: false }}
      />

      <StatCard
        title="Recent Orders"
        value={formatNumber(stats.orderStats.recentOrders)}
        icon={TrendingUp}
        description="Last 30 days"
        trend={{ value: 25, isPositive: true }}
      />

      <StatCard
        title="New Products"
        value={formatNumber(stats.productStats.newThisMonth)}
        icon={BarChart3}
        description="Added this month"
        trend={{ value: 10, isPositive: true }}
      />
    </div>
  );
};
