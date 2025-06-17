"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdvancedTable, type Column } from "@/components/advanced-table"
import { Badge } from "@/components/ui/badge"
import { Plus, Users, Globe, Shield } from "lucide-react"

interface Account {
  id: string
  marketplace: string
  accName: string
  profileName: string
  sheetID: string
  accountInfo: string
  proxy: string
  clientID: string
  clientSecret: string
  telegramId: string
  status: "active" | "inactive" | "suspended"
  createdAt: string
  lastSync: string
}

const mockAccounts: Account[] = [
  {
    id: "1",
    marketplace: "eBay",
    accName: "ebay_store_01",
    profileName: "Main Store",
    sheetID: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    accountInfo: "Active seller account",
    proxy: "192.168.1.100:8080",
    clientID: "client_123",
    clientSecret: "secret_456",
    telegramId: "@store_bot",
    status: "active",
    createdAt: "2024-01-15",
    lastSync: "2024-01-20 10:30:00",
  },
  {
    id: "2",
    marketplace: "Amazon",
    accName: "amz_seller_02",
    profileName: "Electronics Store",
    sheetID: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    accountInfo: "Professional seller",
    proxy: "192.168.1.101:8080",
    clientID: "client_789",
    clientSecret: "secret_012",
    telegramId: "@electronics_bot",
    status: "active",
    createdAt: "2024-01-10",
    lastSync: "2024-01-20 09:15:00",
  },
  {
    id: "3",
    marketplace: "Walmart",
    accName: "walmart_seller_03",
    profileName: "Home & Garden",
    sheetID: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    accountInfo: "New seller account",
    proxy: "192.168.1.102:8080",
    clientID: "client_456",
    clientSecret: "secret_789",
    telegramId: "@garden_bot",
    status: "inactive",
    createdAt: "2024-01-05",
    lastSync: "2024-01-18 14:20:00",
  },
  {
    id: "4",
    marketplace: "eBay",
    accName: "ebay_store_04",
    profileName: "Fashion Store",
    sheetID: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    accountInfo: "Premium seller",
    proxy: "192.168.1.103:8080",
    clientID: "client_111",
    clientSecret: "secret_222",
    telegramId: "@fashion_bot",
    status: "suspended",
    createdAt: "2024-01-01",
    lastSync: "2024-01-15 16:45:00",
  },
]

const getMarketplaceBadge = (marketplace: string) => {
  const colors = {
    eBay: "bg-blue-500 text-white",
    Amazon: "bg-orange-500 text-white",
    Walmart: "bg-green-500 text-white",
  }
  return <Badge className={colors[marketplace as keyof typeof colors] || ""}>{marketplace}</Badge>
}

const getStatusBadge = (status: string) => {
  const variants = {
    active: "default",
    inactive: "secondary",
    suspended: "destructive",
  } as const
  return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
}

export default function AccountsPage() {
  const [data, setData] = useState<Account[]>(mockAccounts)

  const columns: Column<Account>[] = [
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
      key: "accName",
      header: "Tên tài khoản",
      sortable: true,
      filterable: true,
      render: (value) => <span className="font-semibold">{value}</span>,
      width: "w-48",
    },
    {
      key: "profileName",
      header: "Profile Name",
      sortable: true,
      filterable: true,
      width: "w-40",
    },
    {
      key: "accountInfo",
      header: "Thông tin",
      filterable: true,
      render: (value) => <span className="text-sm text-gray-600 truncate max-w-32 block">{value}</span>,
      width: "w-48",
    },
    {
      key: "proxy",
      header: "Proxy",
      filterable: true,
      render: (value) => <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">{value}</code>,
      width: "w-36",
    },
    {
      key: "telegramId",
      header: "Telegram",
      filterable: true,
      render: (value) => <span className="text-blue-600 dark:text-blue-400">{value}</span>,
      width: "w-32",
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["active", "inactive", "suspended"],
      render: (value) => getStatusBadge(value),
      width: "w-32",
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      sortable: true,
      width: "w-28",
    },
    {
      key: "lastSync",
      header: "Sync cuối",
      sortable: true,
      width: "w-36",
    },
  ]

  const handleEdit = (account: Account) => {
    console.log("Edit account:", account.id)
  }

  const handleDelete = (account: Account) => {
    setData(data.filter((item) => item.id !== account.id))
  }

  const handleExport = () => {
    const csvContent = [
      Object.keys(mockAccounts[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "accounts.csv"
    a.click()
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Quản lý tài khoản
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Tổng tài khoản</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.length}</div>
              <p className="text-xs opacity-80">Đang quản lý</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Đang hoạt động</CardTitle>
              <Globe className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.filter((acc) => acc.status === "active").length}</div>
              <p className="text-xs opacity-80">Tài khoản active</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-violet-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Marketplace</CardTitle>
              <Shield className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(data.map((acc) => acc.marketplace)).size}</div>
              <p className="text-xs opacity-80">Nền tảng khác nhau</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-gray-100">Danh sách tài khoản</CardTitle>
                <CardDescription>
                  Quản lý tất cả tài khoản marketplace. Sử dụng search và filter để tìm kiếm dữ liệu.
                </CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm tài khoản
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
              searchPlaceholder="Tìm kiếm tài khoản..."
            />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
