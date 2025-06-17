"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

interface Order {
  id: string
  poNumber: string
  customerName: string
  account: string
  marketplace: string
  sku: string
  status: string
  trackingStatus: string
  shipBy: string
  orderDate: Date
  amount: number
}

const mockOrders: Order[] = [
  {
    id: "1",
    poNumber: "PO-2024-001",
    customerName: "Nguyễn Văn A",
    account: "ebay_store_01",
    marketplace: "eBay",
    sku: "SKU001",
    status: "Processing",
    trackingStatus: "In Transit",
    shipBy: "FedEx",
    orderDate: new Date("2024-01-15"),
    amount: 1299,
  },
  {
    id: "2",
    poNumber: "PO-2024-002",
    customerName: "Trần Thị B",
    account: "amz_seller_02",
    marketplace: "Amazon",
    sku: "SKU002",
    status: "Shipped",
    trackingStatus: "Delivered",
    shipBy: "UPS",
    orderDate: new Date("2024-01-14"),
    amount: 999,
  },
]

export default function OrdersPage() {
  const [orders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAccount, setSelectedAccount] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedTrackingStatus, setSelectedTrackingStatus] = useState<string>("all")
  const [selectedShipBy, setSelectedShipBy] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      Processing: "secondary",
      Shipped: "default",
      Delivered: "outline",
      Cancelled: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const getTrackingBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "In Transit": "secondary",
      Delivered: "default",
      Pending: "outline",
      Lost: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAccount = selectedAccount === "all" || order.account === selectedAccount
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
    const matchesTrackingStatus = selectedTrackingStatus === "all" || order.trackingStatus === selectedTrackingStatus
    const matchesShipBy = selectedShipBy === "all" || order.shipBy === selectedShipBy

    const matchesDateRange = (!dateFrom || order.orderDate >= dateFrom) && (!dateTo || order.orderDate <= dateTo)

    return (
      matchesSearch && matchesAccount && matchesStatus && matchesTrackingStatus && matchesShipBy && matchesDateRange
    )
  })

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Quản lý đơn hàng</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Bộ lọc</CardTitle>
            <CardDescription>Lọc đơn hàng theo các tiêu chí</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tìm kiếm</label>
                <Input
                  placeholder="PO# hoặc tên khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tài khoản</label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tài khoản" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="ebay_store_01">ebay_store_01</SelectItem>
                    <SelectItem value="amz_seller_02">amz_seller_02</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Trạng thái</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tracking Status</label>
                <Select value={selectedTrackingStatus} onValueChange={setSelectedTrackingStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tracking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ship By</label>
                <Select value={selectedShipBy} onValueChange={setSelectedShipBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Đơn vị vận chuyển" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="FedEx">FedEx</SelectItem>
                    <SelectItem value="UPS">UPS</SelectItem>
                    <SelectItem value="DHL">DHL</SelectItem>
                    <SelectItem value="USPS">USPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Từ ngày</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedAccount("all")
                  setSelectedStatus("all")
                  setSelectedTrackingStatus("all")
                  setSelectedShipBy("all")
                  setDateFrom(undefined)
                  setDateTo(undefined)
                }}
              >
                Xóa bộ lọc
              </Button>
              <Button>
                <RefreshCw className="h-4 w-4 mr-2" />
                Đồng bộ API
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn hàng ({filteredOrders.length})</CardTitle>
            <CardDescription>Quản lý đơn hàng từ các marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PO#</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Marketplace</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Tracking</TableHead>
                  <TableHead>Ship By</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead>Số tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.poNumber}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.account}</TableCell>
                    <TableCell>{order.marketplace}</TableCell>
                    <TableCell>{order.sku}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getTrackingBadge(order.trackingStatus)}</TableCell>
                    <TableCell>{order.shipBy}</TableCell>
                    <TableCell>{format(order.orderDate, "dd/MM/yyyy", { locale: vi })}</TableCell>
                    <TableCell>${order.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
