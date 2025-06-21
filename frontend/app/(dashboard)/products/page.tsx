"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import { Box } from "@mui/material";
import { DataGrid, GridRowSelectionModel } from "@mui/x-data-grid";
import { Pagination } from "@/components/ui/pagination";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { ProductDialog } from "@/components/products/ProductDialog";
import { getProductColumns } from "@/components/products/productColumns";
import {
  useProducts,
  useDeleteProduct,
  useBulkDeleteProducts,
  useCreateProduct,
  useUpdateProduct,
  Product,
} from "@/lib/hooks/useProducts";

export default function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // API hooks
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useProducts({ page, search: debouncedSearch });
  const deleteProductMutation = useDeleteProduct();
  const bulkDeleteMutation = useBulkDeleteProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const products = productsResponse?.data?.data || [];
  const meta = productsResponse?.data?.meta;
  const totalPages = meta?.totalPages || 1;
  const itemsPerPage = meta?.limit || 10;
  const totalItems = meta?.total || 0;

  const getSelectedIds = () => {
    if (!selectedRows || !selectedRows.ids) return [];
    return Array.from(selectedRows.ids);
  };
  const selectedIds = getSelectedIds();
  const selectedCount = selectedIds.length;

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Bạn có chắc muốn xóa sản phẩm ${product.name}?`)) {
      deleteProductMutation.mutate(product._id);
    }
  };

  const handleBulkDelete = () => {
    if (selectedCount === 0) return;
    const selectedProducts = products.filter((product: Product) =>
      selectedIds.includes(product._id)
    );
    const productNames = selectedProducts
      .map((product: Product) => product.name)
      .join(", ");
    if (
      confirm(
        `Bạn có chắc muốn xóa ${selectedCount} sản phẩm: ${productNames}?`
      )
    ) {
      bulkDeleteMutation.mutate(selectedIds.map((id) => id.toString()));
      setSelectedRows(undefined);
    }
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: Partial<Product>) => {
    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct._id,
        data,
      });
    } else {
      createProductMutation.mutate(data as any);
    }
  };

  // Columns cho DataGrid
  const columns = getProductColumns({
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
          <div className="text-red-500">Error loading products</div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
          Quản lý sản phẩm
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-gray-900 dark:to-gray-800">
        {/* Main Table */}
        <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  Danh sách sản phẩm
                </CardTitle>
                {selectedCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    Đã chọn {selectedCount} sản phẩm
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
                <ProductDialog
                  isOpen={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  editingProduct={editingProduct}
                  onAddClick={handleAddClick}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="w-full">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="relative group max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg shadow-purple-500/10">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4 z-10 group-hover:text-purple-500 transition-colors duration-200" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm..."
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
            {/* DataGrid Table with horizontal scroll */}
            <Box
              sx={{
                height: "calc(100vh - 400px)",
                width: "100%",
              }}
            >
              <DataGrid
                rows={products}
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
              onPageChange={(page) => setPage(page)}
            />
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
