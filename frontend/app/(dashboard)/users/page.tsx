"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { useUsers, useDeleteUser, type User } from "@/lib/hooks/useUsers";
import { UserDialog } from "@/components/users/UserDialog";

// MUI DataGrid imports
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { getUserColumns } from "@/components/users/userColumns";
import { Pagination } from "@/components/ui/pagination";

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // TanStack Query hooks
  const { data: usersResponse, isLoading, error } = useUsers();
  const deleteUserMutation = useDeleteUser();

  const users = usersResponse?.data?.data || [];

  const handleEdit = (user: User) => {
    setEditingUser(user);
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

  const handleAddClick = () => {
    setEditingUser(null);
    setIsDialogOpen(true);
  };

  // Get columns with handlers
  const columns = getUserColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

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
                <UserDialog
                  isOpen={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  editingUser={editingUser}
                  onAddClick={handleAddClick}
                />
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
                hideFooter={true}
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

            <Pagination
              className="mt-4"
              currentPage={1}
              totalItems={45}
              itemsPerPage={25}
              totalPages={2}
              onPageChange={() => console.log("hello")}
            />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
