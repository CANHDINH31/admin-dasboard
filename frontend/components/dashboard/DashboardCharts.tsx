import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartDataProps {
  chartData: {
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
  };
  stats: {
    orderStats: {
      byStatus: Array<{ _id: string; count: number }>;
    };
    accountStats: {
      byMarketplace: Array<{ _id: string; count: number }>;
    };
    taskStats: {
      byType: Array<{ _id: string; count: number }>;
    };
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const DashboardCharts: React.FC<ChartDataProps> = ({
  chartData,
  stats,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {/* Revenue Trend Chart */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.revenueTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="_id"
                tickFormatter={formatDate}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), ""]}
                labelFormatter={formatDate}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={2}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Order Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.orderStats.byStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, percent }) =>
                  `${_id} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.orderStats.byStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Account Distribution by Marketplace */}
      <Card>
        <CardHeader>
          <CardTitle>Accounts by Marketplace</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.accountStats.byMarketplace}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Task Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.taskStats.byType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Order Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Order Trends (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.orderTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="_id"
                tickFormatter={formatDate}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip labelFormatter={formatDate} />
              <Bar dataKey="orders" fill="#8884d8" name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
