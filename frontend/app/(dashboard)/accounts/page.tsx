"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Box } from "@mui/material";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { Pagination } from "@/components/ui/pagination";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { AccountDialog } from "@/components/accounts/AccountDialog";
import { getAccountColumns } from "@/components/accounts/accountColumns";
import { AccountStats } from "@/components/accounts/AccountStats";

interface Account {
  id: string;
  marketplace: string;
  accName: string;
  profileName: string;
  sheetID: string;
  accountInfo: string;
  proxy: string;
  clientID: string;
  clientSecret: string;
  telegramId: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastSync: string;
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
];

export default function AccountsPage() {
  const [data, setData] = useState<Account[]>(mockAccounts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const itemsPerPage = 10;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pagedData = data
    .filter((row) => {
      if (!debouncedSearch) return true;
      return (
        row.accName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        row.marketplace.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        row.profileName.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    })
    .slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getSelectedIds = () => {
    if (!selectedRows || !selectedRows.ids) return [];
    return Array.from(selectedRows.ids);
  };
  const selectedIds = getSelectedIds();
  const selectedCount = selectedIds.length;

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const handleDelete = (account: any) => {
    if (confirm(`Bạn có chắc muốn xóa tài khoản ${account.accName}?`)) {
      setData((prev) => prev.filter((item) => item.id !== account.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    const selectedAccounts = data.filter((acc) => selectedIds.includes(acc.id));
    const accNames = selectedAccounts.map((acc) => acc.accName).join(", ");
    if (
      confirm(`Bạn có chắc muốn xóa ${selectedCount} tài khoản: ${accNames}?`)
    ) {
      setData((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelectedRows(undefined);
    }
  };

  const handleAddClick = () => {
    setEditingAccount(null);
    setIsDialogOpen(true);
  };

  // Columns cho DataGrid
  const columns = getAccountColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Quản lý tài khoản
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        {/* Main Table */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  Danh sách tài khoản
                </CardTitle>
                {selectedCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Đã chọn {selectedCount} tài khoản
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {selectedCount > 0 && (
                  <Button
                    variant="destructive"
                    onClick={handleBulkDelete}
                    className="flex items-center gap-2"
                  >
                    Xóa ({selectedCount})
                  </Button>
                )}
                <AccountDialog
                  isOpen={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  editingAccount={editingAccount}
                  onAddClick={handleAddClick}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="relative group max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg shadow-green-500/10">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 z-10 group-hover:text-green-500 transition-colors duration-200" />
                  <Input
                    placeholder="Tìm kiếm tài khoản..."
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
                  <div className="bg-green-500 text-white rounded-full p-0.5 shadow-lg">
                    <Loader2 className="h-3 w-3 animate-spin" />
                  </div>
                </div>
              )}
            </div>
            <Box sx={{ height: "calc(100vh - 280px)", width: "100%" }}>
              <DataGrid
                rows={pagedData}
                columns={columns}
                getRowId={(row) => row.id}
                rowHeight={80}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(newSelectionModel) => {
                  setSelectedRows(newSelectionModel);
                }}
                rowSelectionModel={selectedRows}
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
              onPageChange={(page) => setPage(page)}
            />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
