"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdvancedTable, type Column } from "@/components/advanced-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Plus, Users, UserCheck, UserX, Crown } from "lucide-react";

const mockUsers = [
  {
    id: "1",
    fullName: "Nguyễn Văn Admin",
    email: "admin@company.com",
    permissions: [
      "view_dashboard",
      "manage_users",
      "manage_accounts",
      "manage_products",
      "manage_orders",
      "manage_tasks",
    ],
    lastLogin: "2024-01-20 10:30:00",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    fullName: "Trần Thị Manager",
    email: "manager@company.com",
    permissions: ["view_dashboard", "manage_products", "manage_orders"],
    lastLogin: "2024-01-20 09:15:00",
    createdAt: "2023-03-20",
  },
  {
    id: "3",
    fullName: "Lê Văn User",
    email: "user@company.com",
    permissions: ["view_dashboard"],
    lastLogin: "2024-01-19 16:45:00",
    createdAt: "2023-06-10",
  },
  {
    id: "4",
    fullName: "Phạm Thị Viewer",
    email: "viewer@company.com",
    permissions: ["view_dashboard"],
    lastLogin: "2024-01-15 14:20:00",
    createdAt: "2023-08-05",
  },
  {
    id: "5",
    fullName: "Hoàng Văn Suspended",
    email: "suspended@company.com",
    permissions: [],
    lastLogin: "2024-01-10 11:30:00",
    createdAt: "2023-04-12",
  },
];

const UserAvatar = ({ user }: { user: any }) => (
  <div className="flex items-center gap-3">
    <Avatar className="h-10 w-10">
      <AvatarImage
        src={user.avatar || "/placeholder.svg"}
        alt={user.fullName}
      />
      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold">
        {user.fullName
          .split(" ")
          .map((n: any) => n[0])
          .join("")
          .slice(0, 2)}
      </AvatarFallback>
    </Avatar>
    <div>
      <div className="font-semibold">{user.fullName}</div>
      <div className="text-sm text-gray-500">{user.email}</div>
    </div>
  </div>
);

export default function UsersPage() {
  const [data, setData] = useState(mockUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    permissions: ["read"],
  });

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
      key: "email",
      header: "Email",
      sortable: true,
      filterable: true,
      width: "w-64",
    },
    {
      key: "permissions",
      header: "Quyền hạn",
      sortable: true,
      filterable: true,
      render: (permissions) => (
        <div className="flex flex-wrap gap-1">
          {permissions.map((permission: string) => (
            <Badge key={permission} variant="secondary">
              {permission}
            </Badge>
          ))}
        </div>
      ),
      width: "w-64",
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
  ];

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "",
      permissions: user.permissions,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (user: any) => {
    if (confirm(`Bạn có chắc muốn xóa user ${user.fullName}?`)) {
      setData(data.filter((item) => item.id !== user.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // Update existing user
      setData(
        data.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
    } else {
      // Add new user
      const newUser = {
        id: Date.now().toString(),
        ...formData,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      setData([...data, newUser]);
    }

    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      permissions: ["read"],
    });
  };

  const handleExport = () => {
    const csvContent = [
      Object.keys(mockUsers[0]).join(","),
      ...data.map((row) =>
        Object.values(row)
          .map((val) => (Array.isArray(val) ? val.join(";") : val))
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  const totalUsers = data.length;
  const activeUsers = data.length;
  const adminUsers = data.filter((u) =>
    u.permissions.includes("manage_users")
  ).length;
  const suspendedUsers = 0;

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
              <CardTitle className="text-sm font-medium opacity-90">
                Tổng users
              </CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs opacity-80">Đang quản lý</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Đang hoạt động
              </CardTitle>
              <UserCheck className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeUsers}</div>
              <p className="text-xs opacity-80">Users active</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Quản trị viên
              </CardTitle>
              <Crown className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminUsers}</div>
              <p className="text-xs opacity-80">Admin users</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-pink-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">
                Bị khóa
              </CardTitle>
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
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  Danh sách người dùng
                </CardTitle>
                <CardDescription>
                  Quản lý users, phân quyền và theo dõi hoạt động. Sử dụng
                  search và filter để tìm kiếm.
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    onClick={() => {
                      setEditingUser(null);
                      setFormData({
                        fullName: "",
                        email: "",
                        password: "",
                        permissions: ["read"],
                      });
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm user
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingUser ? "Chỉnh sửa user" : "Thêm user mới"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingUser
                        ? "Cập nhật thông tin user"
                        : "Tạo tài khoản user mới cho hệ thống"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Họ tên *</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Mật khẩu *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Quyền hạn</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="view_dashboard"
                            checked={formData.permissions.includes(
                              "view_dashboard"
                            )}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...formData.permissions, "view_dashboard"]
                                : formData.permissions.filter(
                                    (p) => p !== "view_dashboard"
                                  );
                              setFormData({
                                ...formData,
                                permissions: newPermissions,
                              });
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="view_dashboard" className="text-sm">
                            Xem dashboard
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="manage_users"
                            checked={formData.permissions.includes(
                              "manage_users"
                            )}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...formData.permissions, "manage_users"]
                                : formData.permissions.filter(
                                    (p) => p !== "manage_users"
                                  );
                              setFormData({
                                ...formData,
                                permissions: newPermissions,
                              });
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="manage_users" className="text-sm">
                            Quản lý users
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="manage_accounts"
                            checked={formData.permissions.includes(
                              "manage_accounts"
                            )}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...formData.permissions, "manage_accounts"]
                                : formData.permissions.filter(
                                    (p) => p !== "manage_accounts"
                                  );
                              setFormData({
                                ...formData,
                                permissions: newPermissions,
                              });
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="manage_accounts" className="text-sm">
                            Quản lý tài khoản
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="manage_products"
                            checked={formData.permissions.includes(
                              "manage_products"
                            )}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...formData.permissions, "manage_products"]
                                : formData.permissions.filter(
                                    (p) => p !== "manage_products"
                                  );
                              setFormData({
                                ...formData,
                                permissions: newPermissions,
                              });
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="manage_products" className="text-sm">
                            Quản lý sản phẩm
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="manage_orders"
                            checked={formData.permissions.includes(
                              "manage_orders"
                            )}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...formData.permissions, "manage_orders"]
                                : formData.permissions.filter(
                                    (p) => p !== "manage_orders"
                                  );
                              setFormData({
                                ...formData,
                                permissions: newPermissions,
                              });
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="manage_orders" className="text-sm">
                            Quản lý đơn hàng
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="manage_tasks"
                            checked={formData.permissions.includes(
                              "manage_tasks"
                            )}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...formData.permissions, "manage_tasks"]
                                : formData.permissions.filter(
                                    (p) => p !== "manage_tasks"
                                  );
                              setFormData({
                                ...formData,
                                permissions: newPermissions,
                              });
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label htmlFor="manage_tasks" className="text-sm">
                            Quản lý công việc
                          </Label>
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit">
                        {editingUser ? "Cập nhật" : "Tạo user"}
                      </Button>
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
  );
}
