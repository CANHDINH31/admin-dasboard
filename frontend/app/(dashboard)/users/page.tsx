"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdvancedTable, type Column } from "@/components/advanced-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Users, Shield, UserCheck, UserX, Crown } from "lucide-react"
import { User } from "lucide-react" // Import User icon

const mockUsers = [
  {
    id: "1",
    fullName: "Nguyễn Văn Admin",
    email: "admin@company.com",
    role: "admin",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+84 901 234 567",
    department: "IT",
    lastLogin: "2024-01-20 10:30:00",
    createdAt: "2023-01-15",
    permissions: ["all"],
    notes: "Super admin với full quyền",
  },
  {
    id: "2",
    fullName: "Trần Thị Manager",
    email: "manager@company.com",
    role: "manager",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    phone: "+84 902 345 678",
    department: "Sales",
    lastLogin: "2024-01-20 09:15:00",
    createdAt: "2023-03-20",
    permissions: ["read", "write", "manage_products"],
    notes: "Quản lý team sales",
  },
  {
    id: "3",
    fullName: "Lê Văn User",
    email: "user@company.com",
    role: "user",
    status: "active",
    phone: "+84 903 456 789",
    department: "Marketing",
    lastLogin: "2024-01-19 16:45:00",
    createdAt: "2023-06-10",
    permissions: ["read", "write"],
    notes: "Nhân viên marketing",
  },
  {
    id: "4",
    fullName: "Phạm Thị Viewer",
    email: "viewer@company.com",
    role: "viewer",
    status: "inactive",
    phone: "+84 904 567 890",
    department: "HR",
    lastLogin: "2024-01-15 14:20:00",
    createdAt: "2023-08-05",
    permissions: ["read"],
    notes: "Chỉ xem báo cáo",
  },
  {
    id: "5",
    fullName: "Hoàng Văn Suspended",
    email: "suspended@company.com",
    role: "user",
    status: "suspended",
    phone: "+84 905 678 901",
    department: "Operations",
    lastLogin: "2024-01-10 11:30:00",
    createdAt: "2023-04-12",
    permissions: [],
    notes: "Tạm khóa do vi phạm policy",
  },
]

const getRoleBadge = (role: string) => {
  const variants = {
    admin: { variant: "default" as const, icon: Crown, color: "text-yellow-600" },
    manager: { variant: "secondary" as const, icon: Shield, color: "text-blue-600" },
    user: { variant: "outline" as const, icon: User, color: "text-green-600" },
    viewer: { variant: "secondary" as const, icon: UserCheck, color: "text-gray-600" },
  }
  const config = variants[role as keyof typeof variants] || variants.user
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className={`h-3 w-3 ${config.color}`} />
      {role}
    </Badge>
  )
}

const getStatusBadge = (status: string) => {
  const variants = {
    active: "default",
    inactive: "secondary",
    suspended: "destructive",
  } as const
  return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
}

const UserAvatar = ({ user }: { user: any }) => (
  <div className="flex items-center gap-3">
    <Avatar className="h-10 w-10">
      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.fullName} />
      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold">
        {user.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)}
      </AvatarFallback>
    </Avatar>
    <div>
      <div className="font-semibold">{user.fullName}</div>
      <div className="text-sm text-gray-500">{user.email}</div>
    </div>
  </div>
)

export default function UsersPage() {
  const [data, setData] = useState(mockUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "user",
    status: "active",
    phone: "",
    department: "",
    notes: "",
  })

  const columns: Column<any>[] = [
    {
      key: "fullName",
      header: "Người dùng",
      sortable: true,
      filterable: true,
      render: (_, user) => <UserAvatar user={user} />,
      width: "w-64",
    },
    {
      key: "role",
      header: "Vai trò",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["admin", "manager", "user", "viewer"],
      render: (value) => getRoleBadge(value),
      width: "w-32",
    },
    {
      key: "department",
      header: "Phòng ban",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["IT", "Sales", "Marketing", "HR", "Operations"],
      width: "w-32",
    },
    {
      key: "phone",
      header: "Số điện thoại",
      filterable: true,
      render: (value) => value || "-",
      width: "w-36",
    },
    {
      key: "status",
      header: "Trạng thái",
      sortable: true,
      filterable: true,
      filterType: "select",
      filterOptions: ["active", "inactive", "suspended"],
      render: (value) => getStatusBadge(value),
      width: "w-28",
    },
    {
      key: "lastLogin",
      header: "Đăng nhập cuối",
      sortable: true,
      render: (value) => new Date(value).toLocaleString("vi-VN"),
      width: "w-40",
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString("vi-VN"),
      width: "w-28",
    },
  ]

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setFormData({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone || "",
      department: user.department,
      notes: user.notes || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (user: any) => {
    if (confirm(`Bạn có chắc muốn xóa user ${user.fullName}?`)) {
      setData(data.filter((item) => item.id !== user.id))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingUser) {
      // Update existing user
      setData(data.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user)))
    } else {
      // Add new user
      const newUser = {
        id: Date.now().toString(),
        ...formData,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString().split("T")[0],
        permissions: formData.role === "admin" ? ["all"] : ["read"],
      }
      setData([...data, newUser])
    }

    setIsDialogOpen(false)
    setEditingUser(null)
    setFormData({
      fullName: "",
      email: "",
      role: "user",
      status: "active",
      phone: "",
      department: "",
      notes: "",
    })
  }

  const handleExport = () => {
    const csvContent = [
      Object.keys(mockUsers[0]).join(","),
      ...data.map((row) =>
        Object.values(row)
          .map((val) => (Array.isArray(val) ? val.join(";") : val))
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    a.click()
  }

  const totalUsers = data.length
  const activeUsers = data.filter((u) => u.status === "active").length
  const adminUsers = data.filter((u) => u.role === "admin").length
  const suspendedUsers = data.filter((u) => u.status === "suspended").length

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Quản lý người dùng
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Tổng users</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs opacity-80">Đang quản lý</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Đang hoạt động</CardTitle>
              <UserCheck className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs opacity-80">Users active</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Quản trị viên</CardTitle>
              <Crown className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUsers}</div>
              <p className="text-xs opacity-80">Admin users</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-pink-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Bị khóa</CardTitle>
              <UserX className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suspendedUsers}</div>
              <p className="text-xs opacity-80">Suspended</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Table */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-gray-100">Danh sách người dùng</CardTitle>
                <CardDescription>
                  Quản lý users, phân quyền và theo dõi hoạt động. Sử dụng search và filter để tìm kiếm.
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    onClick={() => {
                      setEditingUser(null)
                      setFormData({
                        fullName: "",
                        email: "",
                        role: "user",
                        status: "active",
                        phone: "",
                        department: "",
                        notes: "",
                      })
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm user
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingUser ? "Chỉnh sửa user" : "Thêm user mới"}</DialogTitle>
                    <DialogDescription>
                      {editingUser ? "Cập nhật thông tin user" : "Tạo tài khoản user mới cho hệ thống"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ tên *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Vai trò</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value) => setFormData({ ...formData, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Trạng thái</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Phòng ban</Label>
                        <Select
                          value={formData.department}
                          onValueChange={(value) => setFormData({ ...formData, department: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn phòng ban" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IT">IT</SelectItem>
                            <SelectItem value="Sales">Sales</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Operations">Operations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Ghi chú</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Ghi chú về user..."
                      />
                    </div>

                    <DialogFooter>
                      <Button type="submit">{editingUser ? "Cập nhật" : "Tạo user"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <AdvancedTable
              data={data}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExport={handleExport}
              searchPlaceholder="Tìm kiếm user..."
            />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
