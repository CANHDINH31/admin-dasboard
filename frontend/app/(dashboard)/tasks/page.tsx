"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Play, Pause, Square, RotateCcw } from "lucide-react"

interface Task {
  id: string
  name: string
  type: string
  account: string
  status: string
  progress: number
  startTime?: Date
  endTime?: Date
  description: string
  logs: string[]
}

const mockTasks: Task[] = [
  {
    id: "1",
    name: "Sync Products - eBay Store",
    type: "Product Sync",
    account: "ebay_store_01",
    status: "Running",
    progress: 65,
    startTime: new Date("2024-01-15T10:30:00"),
    description: "Đồng bộ sản phẩm từ eBay API",
    logs: ["10:30:00 - Task started", "10:31:15 - Fetched 150 products", "10:32:30 - Processing product updates..."],
  },
  {
    id: "2",
    name: "Order Tracking Update",
    type: "Order Tracking",
    account: "amz_seller_02",
    status: "Completed",
    progress: 100,
    startTime: new Date("2024-01-15T09:00:00"),
    endTime: new Date("2024-01-15T09:15:00"),
    description: "Cập nhật trạng thái tracking đơn hàng",
    logs: ["09:00:00 - Task started", "09:05:30 - Updated 25 orders", "09:15:00 - Task completed successfully"],
  },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      Running: "default",
      Completed: "outline",
      Failed: "destructive",
      Paused: "secondary",
      Pending: "secondary",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const handleTaskAction = (taskId: string, action: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          switch (action) {
            case "start":
              return { ...task, status: "Running", startTime: new Date() }
            case "pause":
              return { ...task, status: "Paused" }
            case "stop":
              return { ...task, status: "Stopped", endTime: new Date() }
            case "restart":
              return { ...task, status: "Running", progress: 0, startTime: new Date(), endTime: undefined }
            default:
              return task
          }
        }
        return task
      }),
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Quản lý tác vụ</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Input placeholder="Tìm kiếm tác vụ..." className="w-64" />
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Loại tác vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="product-sync">Product Sync</SelectItem>
                <SelectItem value="order-tracking">Order Tracking</SelectItem>
                <SelectItem value="inventory-update">Inventory Update</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo tác vụ mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo tác vụ mới</DialogTitle>
                <DialogDescription>Thiết lập tác vụ tự động cho hệ thống</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="taskName">Tên tác vụ</Label>
                  <Input id="taskName" placeholder="Nhập tên tác vụ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskType">Loại tác vụ</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại tác vụ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product-sync">Product Sync</SelectItem>
                      <SelectItem value="order-tracking">Order Tracking</SelectItem>
                      <SelectItem value="inventory-update">Inventory Update</SelectItem>
                      <SelectItem value="price-monitor">Price Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Tài khoản</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tài khoản" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ebay_store_01">ebay_store_01</SelectItem>
                      <SelectItem value="amz_seller_02">amz_seller_02</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea id="description" placeholder="Mô tả chi tiết tác vụ" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Tạo tác vụ</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng tác vụ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "Running").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "Completed").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lỗi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.filter((t) => t.status === "Failed").length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách tác vụ</CardTitle>
            <CardDescription>Theo dõi và điều khiển các tác vụ tự động</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên tác vụ</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Thời gian bắt đầu</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>{task.type}</TableCell>
                    <TableCell>{task.account}</TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${task.progress}%` }}></div>
                        </div>
                        <span className="text-sm">{task.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{task.startTime ? task.startTime.toLocaleString("vi-VN") : "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {task.status !== "Running" && (
                          <Button variant="outline" size="sm" onClick={() => handleTaskAction(task.id, "start")}>
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {task.status === "Running" && (
                          <Button variant="outline" size="sm" onClick={() => handleTaskAction(task.id, "pause")}>
                            <Pause className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleTaskAction(task.id, "stop")}>
                          <Square className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleTaskAction(task.id, "restart")}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
