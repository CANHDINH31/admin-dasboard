"use client";

import type React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import {
  useUsers,
  useDeleteUser,
  useBulkDeleteUsers,
  type User,
} from "@/lib/hooks/useUsers";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { UserDialog } from "@/components/users/UserDialog";

// MUI DataGrid imports
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { getUserColumns } from "@/components/users/userColumns";
import { Pagination } from "@/components/ui/pagination";

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>();
  const [search, setSearch] = useState("");

  // Use debounce hook
  const debouncedSearch = useDebounce(search, 500);

  // TanStack Query hooks
  const {
    data: usersResponse,
    isLoading,
    error,
  } = useUsers({ page, limit: itemsPerPage, search: debouncedSearch });
  const deleteUserMutation = useDeleteUser();
  const bulkDeleteMutation = useBulkDeleteUsers();

  const users = usersResponse?.data?.data || [];
  const meta = usersResponse?.data?.meta;
  const totalPages = meta?.totalPages || 1;
  const totalItems = meta?.total || 0;

  // Helper function to get selected IDs as array
  const getSelectedIds = () => {
    if (!selectedRows || !selectedRows.ids) return [];
    return Array.from(selectedRows.ids);
  };

  const selectedIds = getSelectedIds();
  const selectedCount = selectedIds.length;

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Bạn có chắc muốn xóa user ${user.fullName}?`)) {
      deleteUserMutation.mutate(user._id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;

    const selectedUsers = users.filter((user) =>
      selectedIds.includes(user._id)
    );
    const userNames = selectedUsers.map((user) => user.fullName).join(", ");

    if (confirm(`Bạn có chắc muốn xóa ${selectedCount} user: ${userNames}?`)) {
      // Sử dụng bulk delete hook
      bulkDeleteMutation.mutate(selectedIds.map((id) => id.toString()));
      setSelectedRows(undefined); // Reset selection
    }
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
                {selectedCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Đã chọn {selectedCount} user
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {selectedCount > 0 && (
                  <Button
                    variant="destructive"
                    onClick={handleBulkDelete}
                    disabled={bulkDeleteMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {bulkDeleteMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang xóa...
                      </>
                    ) : (
                      `Xóa (${selectedCount})`
                    )}
                  </Button>
                )}
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
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="relative group max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg shadow-blue-500/10">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 z-10 group-hover:text-blue-500 transition-colors duration-200" />
                  <Input
                    placeholder="Tìm kiếm người dùng..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-9 py-2 h-10 text-sm border-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400 group-hover:placeholder:text-gray-500 transition-all duration-200"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200 hover:scale-110"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              {debouncedSearch !== search && (
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
                  <div className="bg-blue-500 text-white rounded-full p-0.5 shadow-lg">
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </div>
                </div>
              )}
            </div>

            <Box sx={{ height: "calc(100vh - 280px)", width: "100%" }}>
              <DataGrid
                rows={users}
                columns={columns}
                getRowId={(row) => row._id}
                rowHeight={80}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(newSelectionModel) => {
                  setSelectedRows(newSelectionModel);
                }}
                rowSelectionModel={selectedRows}
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
              currentPage={page}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              onItemsPerPageChange={(itemsPerPage) => {
                setItemsPerPage(itemsPerPage);
                setPage(1);
              }}
              onPageChange={(page) => setPage(page)}
            />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
