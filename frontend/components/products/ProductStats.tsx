import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign } from "lucide-react";

export function ProductStats({ data }: { data: any[] }) {
  const totalProducts = data.length;
  const totalRevenue = data.reduce(
    (sum, product) => sum + (product.sellingPrice || 0),
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Tổng sản phẩm
          </CardTitle>
          <Package className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProducts}</div>
          <p className="text-xs opacity-80">Đang quản lý</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Tổng giá trị
          </CardTitle>
          <DollarSign className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs opacity-80">Giá trị tồn kho</p>
        </CardContent>
      </Card>
    </div>
  );
}
