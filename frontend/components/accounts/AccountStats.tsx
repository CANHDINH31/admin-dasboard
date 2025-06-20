import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Globe, Shield } from "lucide-react";

export function AccountStats({ data }: { data: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Tổng tài khoản
          </CardTitle>
          <Users className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.length}</div>
          <p className="text-xs opacity-80">Đang quản lý</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Đang hoạt động
          </CardTitle>
          <Globe className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.filter((acc) => acc.status === "active").length}
          </div>
          <p className="text-xs opacity-80">Tài khoản active</p>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">
            Marketplace
          </CardTitle>
          <Shield className="h-5 w-5 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Set(data.map((acc) => acc.marketplace)).size}
          </div>
          <p className="text-xs opacity-80">Nền tảng khác nhau</p>
        </CardContent>
      </Card>
    </div>
  );
}
