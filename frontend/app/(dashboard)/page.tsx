import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Users, Package, ShoppingCart, CheckSquare, TrendingUp, DollarSign } from "lucide-react"

export default function Dashboard() {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Tổng tài khoản</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <p className="text-xs opacity-80 mt-1">+2 từ tháng trước</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Sản phẩm</CardTitle>
              <Package className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,234</div>
              <p className="text-xs opacity-80 mt-1">+15% từ tháng trước</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Đơn hàng</CardTitle>
              <ShoppingCart className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">567</div>
              <p className="text-xs opacity-80 mt-1">+8% từ tuần trước</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-500 to-rose-600 text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Tác vụ hoạt động</CardTitle>
              <CheckSquare className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs opacity-80 mt-1">3 hoàn thành hôm nay</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Doanh thu tháng này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">$45,231</div>
              <p className="text-sm text-muted-foreground mt-1">+20.1% so với tháng trước</p>
              <div className="mt-4 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-500" />
                Lợi nhuận
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">$12,456</div>
              <p className="text-sm text-muted-foreground mt-1">+12.5% so với tháng trước</p>
              <div className="mt-4 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "Đồng bộ sản phẩm eBay", time: "2 phút trước", status: "success" },
                { action: "Cập nhật đơn hàng Amazon", time: "5 phút trước", status: "success" },
                { action: "Tracking đơn hàng #12345", time: "10 phút trước", status: "warning" },
                { action: "Backup dữ liệu", time: "1 giờ trước", status: "success" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.status === "success"
                          ? "bg-green-500 shadow-lg shadow-green-500/50"
                          : item.status === "warning"
                            ? "bg-yellow-500 shadow-lg shadow-yellow-500/50"
                            : "bg-red-500 shadow-lg shadow-red-500/50"
                      }`}
                    ></div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item.action}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
