"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, X, Filter, Calendar } from "lucide-react";
import { Box } from "@mui/material";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { Pagination } from "@/components/ui/pagination";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { OrderDialog } from "@/components/orders/OrderDialog";
import { getOrderColumns } from "@/components/orders/orderColumns";
import {
  useOrders,
  useDeleteOrder,
  useBulkDeleteOrders,
  useCreateOrder,
  useUpdateOrder,
  Order,
} from "@/lib/hooks/useOrders";

export default function OrdersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>();

  // Filter states
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [account, setAccount] = useState("");
  const [trackingStatus, setTrackingStatus] = useState("all");
  const [sku, setSku] = useState("");
  const [shipByStart, setShipByStart] = useState("");
  const [shipByEnd, setShipByEnd] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search
  const debouncedSearch = useDebounce(search, 500);

  // API hooks
  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useOrders({
    page,
    limit: itemsPerPage,
    search: debouncedSearch,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    account: account || undefined,
    trackingStatus: trackingStatus !== "all" ? trackingStatus : undefined,
    sku: sku || undefined,
    shipByStart: shipByStart || undefined,
    shipByEnd: shipByEnd || undefined,
  });

  const deleteOrderMutation = useDeleteOrder();
  const bulkDeleteMutation = useBulkDeleteOrders();
  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();

  const orders = ordersResponse?.data?.data || [];
  const meta = ordersResponse?.data?.meta;
  const totalPages = meta?.totalPages || 1;
  const totalItems = meta?.total || 0;

  const getSelectedIds = () => {
    if (!selectedRows || !selectedRows.ids) return [];
    return Array.from(selectedRows.ids);
  };
  const selectedIds = getSelectedIds();
  const selectedCount = selectedIds.length;

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setIsDialogOpen(true);
  };

  const handleDelete = (order: Order) => {
    if (confirm(`Bạn có chắc muốn xóa đơn hàng ${order.orderNumber}?`)) {
      deleteOrderMutation.mutate(order._id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    const selectedOrders = orders.filter((order: Order) =>
      selectedIds.includes(order._id)
    );
    const orderNumbers = selectedOrders
      .map((order: Order) => order.orderNumber)
      .join(", ");
    if (
      confirm(
        `Bạn có chắc muốn xóa ${selectedCount} đơn hàng: ${orderNumbers}?`
      )
    ) {
      bulkDeleteMutation.mutate(selectedIds.map((id) => id.toString()));
      setSelectedRows(undefined);
    }
  };

  const handleAddClick = () => {
    setEditingOrder(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: Partial<Order>) => {
    if (editingOrder) {
      updateOrderMutation.mutate({
        id: editingOrder._id,
        data,
      });
    } else {
      createOrderMutation.mutate(data as any);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setAccount("");
    setTrackingStatus("all");
    setSku("");
    setShipByStart("");
    setShipByEnd("");
    setPage(1);
  };

  const hasActiveFilters =
    search ||
    startDate ||
    endDate ||
    account ||
    (trackingStatus && trackingStatus !== "all") ||
    sku ||
    shipByStart ||
    shipByEnd;

  // Columns cho DataGrid
  const columns = getOrderColumns({
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
          <div className="text-red-500">Error loading orders</div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
          Quản lý đơn hàng
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
        {/* Main Table */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  Danh sách đơn hàng
                </CardTitle>
                {selectedCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Đã chọn {selectedCount} đơn hàng
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
                <OrderDialog
                  isOpen={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  editingOrder={editingOrder}
                  onAddClick={handleAddClick}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="w-full">
            {/* Search and Filter Section */}
            <div className="space-y-4 mb-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="relative group max-w-md">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg shadow-purple-500/10">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 z-10 group-hover:text-purple-500 transition-colors duration-200" />
                    <Input
                      placeholder="Tìm kiếm theo PO# hoặc tên sản phẩm..."
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
                    <div className="bg-purple-500 text-white rounded-full p-0.5 shadow-lg">
                      <Loader2 className="h-3 w-3 animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Toggle Button */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Bộ lọc
                  {hasActiveFilters && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-500 hover:text-red-700"
                  >
                    Xóa bộ lọc
                  </Button>
                )}
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                  {/* Date Range Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Thời gian đặt hàng
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="date"
                        placeholder="Từ ngày"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        type="date"
                        placeholder="Đến ngày"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  {/* Account Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tài khoản</Label>
                    <Input
                      placeholder="Email tài khoản"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  {/* Tracking Status Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Trạng thái giao hàng
                    </Label>
                    <Select
                      value={trackingStatus}
                      onValueChange={setTrackingStatus}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="pending">Chờ xử lý</SelectItem>
                        <SelectItem value="processing">Đang xử lý</SelectItem>
                        <SelectItem value="shipped">Đã giao hàng</SelectItem>
                        <SelectItem value="delivered">Đã nhận hàng</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* SKU Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">SKU</Label>
                    <Input
                      placeholder="Mã SKU"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  {/* Ship By Date Range Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Thời gian giao hàng
                    </Label>
                    <div className="space-y-2">
                      <Input
                        type="date"
                        placeholder="Từ ngày"
                        value={shipByStart}
                        onChange={(e) => setShipByStart(e.target.value)}
                        className="text-sm"
                      />
                      <Input
                        type="date"
                        placeholder="Đến ngày"
                        value={shipByEnd}
                        onChange={(e) => setShipByEnd(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DataGrid Table with horizontal scroll */}
            <Box
              sx={{
                height: "calc(100vh - 400px)",
                width: "100%",
              }}
            >
              <DataGrid
                rows={orders}
                columns={columns}
                getRowId={(row) => row._id}
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
