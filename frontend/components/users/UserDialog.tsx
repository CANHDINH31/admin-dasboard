"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useCreateUser, useUpdateUser, type User } from "@/lib/hooks/useUsers";
import {
  AVAILABLE_PERMISSIONS,
  getPermissionConfig,
} from "@/lib/constants/permissions";

interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: User | null;
  onAddClick: () => void;
}

export function UserDialog({
  isOpen,
  onOpenChange,
  editingUser,
  onAddClick,
}: UserDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
    permissions: [] as string[],
  });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  // Reset form when editing user changes
  useEffect(() => {
    if (editingUser) {
      setFormData({
        fullName: editingUser.fullName,
        email: editingUser.email,
        password: "",
        role: editingUser.role,
        permissions: editingUser.permissions,
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "user",
        permissions: [],
      });
    }
  }, [editingUser]);

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

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          onClick={onAddClick}
        >
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
                    checked={formData.permissions.includes(permission)}
                    onChange={(e) => {
                      const newPermissions = e.target.checked
                        ? [...formData.permissions, permission]
                        : formData.permissions.filter((p) => p !== permission);
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
                createUserMutation.isPending || updateUserMutation.isPending
              }
            >
              {createUserMutation.isPending || updateUserMutation.isPending ? (
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
  );
}
