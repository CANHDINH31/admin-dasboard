"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  sku: string;
  name: string;
  account: string;
  marketplace: string;
  price: number;
  stock: number;
  status: string;
  trackingStatus: string;
  views: number;
  sales: number;
  revenue: number;
  conversionRate: number;
  lastUpdated: string;
}

const mockProducts: Product[] = [
  {
    id: "1",
    sku: "SKU001",
    name: "iPhone 15 Pro Max 256GB",
    account: "ebay_store_01",
    marketplace: "eBay",
    price: 1299,
    stock: 25,
    status: "active",
    trackingStatus: "tracking",
    views: 1250,
    sales: 15,
    revenue: 19485,
    conversionRate: 1.2,
    lastUpdated: "2024-01-20 10:30:00",
  },
  {
    id: "2",
    sku: "SKU002",
    name: "Samsung Galaxy S24 Ultra",
    account: "amz_seller_02",
    marketplace: "Amazon",
    price: 999,
    stock: 0,
    status: "out of stock",
    trackingStatus: "paused",
    views: 890,
    sales: 8,
    revenue: 7992,
    conversionRate: 0.9,
    lastUpdated: "2024-01-19 15:20:00",
  },
  {
    id: "3",
    sku: "SKU003",
    name: "MacBook Air M3 13-inch",
    account: "walmart_seller_03",
    marketplace: "Walmart",
    price: 1199,
    stock: 12,
    status: "active",
    trackingStatus: "tracking",
    views: 2100,
    sales: 22,
    revenue: 26378,
    conversionRate: 1.05,
    lastUpdated: "2024-01-20 09:15:00",
  },
  {
    id: "4",
    sku: "SKU004",
    name: "AirPods Pro 2nd Generation",
    account: "ebay_store_01",
    marketplace: "eBay",
    price: 249,
    stock: 45,
    status: "active",
    trackingStatus: "tracking",
    views: 3200,
    sales: 67,
    revenue: 16683,
    conversionRate: 2.1,
    lastUpdated: "2024-01-20 11:45:00",
  },
  {
    id: "5",
    sku: "SKU005",
    name: "Dell XPS 13 Laptop",
    account: "amz_seller_02",
    marketplace: "Amazon",
    price: 899,
    stock: 8,
    status: "active",
    trackingStatus: "tracking",
    views: 1580,
    sales: 12,
    revenue: 10788,
    conversionRate: 0.76,
    lastUpdated: "2024-01-20 08:20:00",
  },
  {
    id: "6",
    sku: "SKU006",
    name: "Sony WH-1000XM5 Headphones",
    account: "walmart_seller_03",
    marketplace: "Walmart",
    price: 349,
    stock: 0,
    status: "out of stock",
    trackingStatus: "paused",
    views: 2450,
    sales: 28,
    revenue: 9772,
    conversionRate: 1.14,
    lastUpdated: "2024-01-19 16:45:00",
  },
];

const getMarketplaceBadge = (marketplace: string) => {
  const colors = {
    eBay: "bg-blue-500 text-white",
    Amazon: "bg-orange-500 text-white",
    Walmart: "bg-green-500 text-white",
  };
  return (
    <Badge className={colors[marketplace as keyof typeof colors] || ""}>
      {marketplace}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  const variants = {
    active: "default",
    inactive: "secondary",
    "out of stock": "destructive",
    tracking: "default",
    paused: "secondary",
    stopped: "destructive",
  } as const;
  return (
    <Badge variant={variants[status as keyof typeof variants] || "outline"}>
      {status}
    </Badge>
  );
};

const CurrencyCell = ({ value }: { value: number }) => (
  <span className="font-mono font-semibold">${value.toLocaleString()}</span>
);

const ProgressBar = ({ value, max = 5 }: { value: number; max?: number }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span>{value}%</span>
        <span>{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function ProductsPage() {
  const [data, setData] = useState<Product[]>(mockProducts);

  const columns: Column<Product>[] = [
    {
      key: "sku",
      header: "SKU",
      sortable: true,
      filterable: true,
      render: (value) => (
        <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">
          {value}
        </code>
      ),
      width: "w-24",
    },
    {
      key: "name",
      header: "Tên sản phẩm",
      sortable: true,
      filterable: true,
      render: (value) => (
        <div className="font-medium text-sm leading-tight py-1 max-w-48 truncate">
          {value}
        </div>
      ),
      width: "w-64",
    },
    {
      key: "marketplace",
      header: "Marketplace",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["eBay", "Amazon", "Walmart"],
      render: (value) => getMarketplaceBadge(value),
      width: "w-32",
    },
    {
      key: "account",
      header: "Tài khoản",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["ebay_store_01", "amz_seller_02", "walmart_seller_03"],
      width: "w-36",
    },
    {
      key: "price",
      header: "Giá",
      sortable: true,
      filterable: true,
      filterType: "number",
      render: (value) => <CurrencyCell value={value} />,
      width: "w-24",
    },
    {
      key: "stock",
      header: "Tồn kho",
      sortable: true,
      filterable: true,
      filterType: "number",
      render: (value) => (
        <span
          className={`font-semibold ${
            value === 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {value}
        </span>
      ),
      width: "w-20",
    },
    {
      key: "views",
      header: "Lượt xem",
      sortable: true,
      filterable: true,
      filterType: "number",
      render: (value) => (
        <span className="text-blue-600 dark:text-blue-400 font-medium">
          {value.toLocaleString()}
        </span>
      ),
      width: "w-24",
    },
    {
      key: "sales",
      header: "Đã bán",
      sortable: true,
      filterable: true,
      filterType: "number",
      render: (value) => (
        <span className="text-green-600 font-semibold">{value}</span>
      ),
      width: "w-20",
    },
    {
      key: "revenue",
      header: "Doanh thu",
      sortable: true,
      filterable: true,
      filterType: "number",
      render: (value) => <CurrencyCell value={value} />,
      width: "w-28",
    },
    {
      key: "conversionRate",
      header: "Tỷ lệ chuyển đổi",
      sortable: true,
      filterable: true,
      filterType: "number",
      render: (value) => <ProgressBar value={value} max={5} />,
      width: "w-36",
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["active", "inactive", "out of stock"],
      render: (value) => getStatusBadge(value),
      width: "w-28",
    },
    {
      key: "trackingStatus",
      header: "Tracking",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["tracking", "paused", "stopped"],
      render: (value) => getStatusBadge(value),
      width: "w-28",
    },
    {
      key: "lastUpdated",
      header: "Cập nhật cuối",
      sortable: true,
      filterable: true,
      width: "w-36",
    },
  ];

  const handleEdit = (product: Product) => {
    console.log("Edit product:", product.id);
  };

  const handleDelete = (product: Product) => {
    setData(data.filter((item) => item.id !== product.id));
  };

  const handleExport = () => {
    const csvContent = [
      Object.keys(mockProducts[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
  };

  const totalProducts = data.length;
  const activeProducts = data.filter((p) => p.status === "active").length;
  const outOfStock = data.filter((p) => p.status === "out of stock").length;
  const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
          Quản lý sản phẩm
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Tổng sản phẩm
              </CardTitle>
              <Eye className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs opacity-80">Đang theo dõi</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Đang hoạt động
              </CardTitle>
              <TrendingUp className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProducts}</div>
              <p className="text-xs opacity-80">Sản phẩm active</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-pink-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Hết hàng
              </CardTitle>
              <TrendingDown className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStock}</div>
              <p className="text-xs opacity-80">Cần bổ sung</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Tổng doanh thu
              </CardTitle>
              <TrendingUp className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs opacity-80">Từ tất cả sản phẩm</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  Danh sách sản phẩm
                </CardTitle>
                <CardDescription>
                  Theo dõi và quản lý sản phẩm theo tài khoản. Sử dụng search và
                  filter để tìm kiếm dữ liệu.
                </CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AdvancedTable
              data={data}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={handleExport}
              searchPlaceholder="Tìm kiếm sản phẩm..."
            />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
