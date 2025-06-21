import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, TrendingUp, Truck } from "lucide-react";
import { Order } from "@/lib/api/orders";

export function OrderStats({ data }: { data: Order[] }) {
  const totalOrders = data.length;
  const totalRevenue = data.reduce(
    (sum, order) => sum + (order.sellingPrice * order.quantity || 0),
    0
  );
  const totalProfit = data.reduce(
    (sum, order) => sum + (order.netProfit || 0),
    0
  );
  const inTransitOrders = data.filter(
    (order) => order.trackingStatus === "In Transit"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Tổng đơn hàng
          </CardTitle>
          <Package className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs opacity-80">Đơn hàng đã tạo</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Tổng doanh thu
          </CardTitle>
          <DollarSign className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs opacity-80">Tổng giá trị đơn hàng</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Lợi nhuận
          </CardTitle>
          <TrendingUp className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalProfit.toLocaleString()}
          </div>
          <p className="text-xs opacity-80">Tổng lợi nhuận ròng</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Đang vận chuyển
          </CardTitle>
          <Truck className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inTransitOrders}</div>
          <p className="text-xs opacity-80">Đơn hàng đang giao</p>
        </CardContent>
      </Card>
    </div>
  );
}
