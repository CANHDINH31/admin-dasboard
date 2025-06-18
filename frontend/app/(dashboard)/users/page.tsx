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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Loader2, Download } from "lucide-react";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  type User,
} from "@/lib/hooks/useUsers";
import {
  AVAILABLE_PERMISSIONS,
  getPermissionConfig,
} from "@/lib/constants/permissions";
import { getUserColumns } from "@/lib/constants/userColumns";

// MUI DataGrid imports
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
    permissions: [] as string[],
  });

  // TanStack Query hooks
  const { data: usersResponse, isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const users = usersResponse?.data?.data || [];

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role,
      permissions: user.permissions,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Bạn có chắc muốn xóa user ${user.fullName}?`)) {
      deleteUserMutation.mutate(user._id);
    }
  };

  const handleExport = () => {
    if (!users.length) return;

    const csvContent = [
      Object.keys(users[0])
        .filter((key) => key !== "_id" && key !== "__v")
        .join(","),
      ...users.map((row) =>
        Object.entries(row)
          .filter(([key]) => key !== "_id" && key !== "__v")
          .map(([_, val]) => (Array.isArray(val) ? val.join(";") : val))
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

  // Get columns with handlers
  const columns = getUserColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // Update existing user
      updateUserMutation.mutate({
        id: editingUser._id,
        data: {
          fullName: formData.fullName,
          email: formData.email,
          role: formData.role,
          permissions: formData.permissions,
          ...(formData.password && { password: formData.password }),
        },
      });
    } else {
      // Create new user
      createUserMutation.mutate({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        permissions: formData.permissions,
      });
    }

    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "user",
      permissions: [],
    });
  };

  if (isLoading) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </SidebarInset>
    );
  }

  if (error) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error loading users</div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Quản lý người dùng
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        {/* Main Table */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  Danh sách người dùng
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Xuất CSV
                </Button>
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
                          role: "user",
                          permissions: [],
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
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">
                            {editingUser
                              ? "Mật khẩu (để trống nếu không đổi)"
                              : "Mật khẩu *"}
                          </Label>
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
                            required={!editingUser}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Vai trò *</Label>
                          <Select
                            value={formData.role}
                            onValueChange={(value: "admin" | "user") =>
                              setFormData({ ...formData, role: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Quyền hạn
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                          {AVAILABLE_PERMISSIONS.map((permission) => (
                            <div
                              key={permission}
                              className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
                            >
                              <input
                                type="checkbox"
                                id={permission}
                                checked={formData.permissions.includes(
                                  permission
                                )}
                                onChange={(e) => {
                                  const newPermissions = e.target.checked
                                    ? [...formData.permissions, permission]
                                    : formData.permissions.filter(
                                        (p) => p !== permission
                                      );
                                  setFormData({
                                    ...formData,
                                    permissions: newPermissions,
                                  });
                                }}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                              />
                              <Label
                                htmlFor={permission}
                                className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                              >
                                {permission}
                              </Label>
                            </div>
                          ))}
                        </div>

                        {formData.permissions.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                              Quyền đã chọn ({formData.permissions.length}):
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {formData.permissions.map((permission) => {
                                const config = getPermissionConfig(permission);
                                return (
                                  <Badge
                                    key={permission}
                                    variant="secondary"
                                    className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  >
                                    <span className="mr-1">{config.icon}</span>
                                    {config.label}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <DialogFooter>
                        <Button
                          type="submit"
                          disabled={
                            createUserMutation.isPending ||
                            updateUserMutation.isPending
                          }
                        >
                          {createUserMutation.isPending ||
                          updateUserMutation.isPending ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {editingUser ? "Đang cập nhật..." : "Đang tạo..."}
                            </>
                          ) : editingUser ? (
                            "Cập nhật"
                          ) : (
                            "Tạo user"
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={users}
                columns={columns}
                getRowId={(row) => row._id}
                rowHeight={80}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 500 },
                  },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 25 },
                  },
                }}
                sx={{
                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #e5e7eb",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f9fafb",
                    borderBottom: "2px solid #e5e7eb",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
