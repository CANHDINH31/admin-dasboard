import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { getPermissionConfig } from "@/lib/constants/permissions";
import type { User } from "@/lib/hooks/useUsers";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";

interface UserColumnsProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const getUserColumns = ({
  onEdit,
  onDelete,
}: UserColumnsProps): GridColDef[] => [
  {
    field: "fullName",
    headerName: "Người dùng",
    width: 250,
    renderCell: (params) => (
      <div className="flex items-center h-full w-full">
        <UserAvatar
          fullName={params.row.fullName}
          email={params.row.email}
          avatar={params.row.avatar}
        />
      </div>
    ),
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
  },
  {
    field: "role",
    headerName: "Vai trò",
    width: 120,
    renderCell: (params) => (
      <Badge variant={params.value === "admin" ? "default" : "secondary"}>
        {params.value === "admin" ? "Admin" : "User"}
      </Badge>
    ),
  },
  {
    field: "permissions",
    headerName: "Quyền hạn",
    width: 350,
    renderCell: (params) => (
      <div className="flex flex-wrap gap-1.5 items-center h-full w-full">
        {params.value.length === 0 ? (
          <span className="text-xs text-gray-400 dark:text-gray-500 italic">
            Không có quyền
          </span>
        ) : (
          params.value.map((permission: string) => {
            const permissionConfig = getPermissionConfig(permission);
            return (
              <span
                key={permission}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 ${permissionConfig.color}`}
                title={permission}
              >
                <span className="text-xs">{permissionConfig.icon}</span>
                <span>{permissionConfig.label}</span>
              </span>
            );
          })
        )}
      </div>
    ),
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 120,
    renderCell: (params) => new Date(params.value).toLocaleDateString("vi-VN"),
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Thao tác",
    width: 120,
    getActions: (params) => [
      <GridActionsCellItem
        icon={<Edit className="h-4 w-4" />}
        label="Chỉnh sửa"
        onClick={() => onEdit(params.row)}
        color="primary"
      />,
      <GridActionsCellItem
        icon={<Trash2 className="h-4 w-4" />}
        label="Xóa"
        onClick={() => onDelete(params.row)}
        color="inherit"
      />,
    ],
  },
];
