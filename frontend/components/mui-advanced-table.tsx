"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  Select,
  Box,
  Typography,
  Chip,
  Toolbar,
  Tooltip,
} from "@mui/material";
import {
  Search,
  FilterList,
  Download,
  MoreVert,
  Edit,
  Delete,
} from "@mui/icons-material";

export interface Column<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: "text" | "select" | "number" | "date";
  filterOptions?: string[];
  render?: (value: any, row: T) => React.ReactNode;
  width?: string | number;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

interface MuiAdvancedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onExport?: () => void;
  searchPlaceholder?: string;
  // Pagination props
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  // Filter props
  onGlobalFilterChange?: (filter: string) => void;
  onColumnFilterChange?: (filters: Record<string, string>) => void;
  // Sort props
  onSortChange?: (
    sortConfig: { key: keyof T; direction: "asc" | "desc" } | null
  ) => void;
  sortConfig?: { key: keyof T; direction: "asc" | "desc" } | null;
  // External state
  globalFilter?: string;
  columnFilters?: Record<string, string>;
  isLoading?: boolean;
}

export function MuiAdvancedTable<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onExport,
  searchPlaceholder = "Tìm kiếm...",
  pagination,
  onPageChange,
  onPageSizeChange,
  onGlobalFilterChange,
  onColumnFilterChange,
  onSortChange,
  sortConfig: externalSortConfig,
  globalFilter: externalGlobalFilter,
  columnFilters: externalColumnFilters,
  isLoading = false,
}: MuiAdvancedTableProps<T>) {
  // Internal state
  const [internalGlobalFilter, setInternalGlobalFilter] = useState("");
  const [internalColumnFilters, setInternalColumnFilters] = useState<
    Record<string, string>
  >({});
  const [internalSortConfig, setInternalSortConfig] = useState<{
    key: keyof T;
    direction: "asc" | "desc";
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  );
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );

  // Use external or internal state
  const globalFilter = externalGlobalFilter ?? internalGlobalFilter;
  const columnFilters = externalColumnFilters ?? internalColumnFilters;
  const sortConfig = externalSortConfig ?? internalSortConfig;

  // Filter data (only if no external handlers provided)
  const filteredData = useMemo(() => {
    if (onGlobalFilterChange || onColumnFilterChange) {
      return data;
    }

    let filtered = data;

    if (globalFilter) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }

    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        filtered = filtered.filter((row) =>
          String(row[key as keyof T])
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      }
    });

    return filtered;
  }, [
    data,
    globalFilter,
    columnFilters,
    onGlobalFilterChange,
    onColumnFilterChange,
  ]);

  // Sort data (only if no external handlers provided)
  const sortedData = useMemo(() => {
    if (onSortChange) {
      return filteredData;
    }

    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, onSortChange]);

  const displayData = pagination ? data : sortedData;

  const handleSort = (key: keyof T) => {
    const newSortConfig: { key: keyof T; direction: "asc" | "desc" } | null =
      sortConfig?.key === key
        ? sortConfig.direction === "asc"
          ? { key, direction: "desc" as const }
          : null
        : { key, direction: "asc" as const };

    if (onSortChange) {
      onSortChange(newSortConfig);
    } else {
      setInternalSortConfig(newSortConfig);
    }
  };

  const handleGlobalFilterChange = (value: string) => {
    if (onGlobalFilterChange) {
      onGlobalFilterChange(value);
    } else {
      setInternalGlobalFilter(value);
    }
  };

  const handleColumnFilterChange = (newFilters: Record<string, string>) => {
    if (onColumnFilterChange) {
      onColumnFilterChange(newFilters);
    } else {
      setInternalColumnFilters(newFilters);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(displayData.map((row) => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedRows(newSelected);
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    onPageChange?.(newPage + 1); // MUI uses 0-based indexing
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPageSizeChange?.(parseInt(event.target.value, 10));
  };

  const isSelected = (id: string | number) => selectedRows.has(id);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {/* Toolbar */}
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <TextField
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => handleGlobalFilterChange(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Tooltip title="Bộ lọc">
            <IconButton onClick={(e) => setFilterAnchorEl(e.currentTarget)}>
              <FilterList />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {onExport && (
            <Tooltip title="Xuất dữ liệu">
              <IconButton onClick={onExport}>
                <Download />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Toolbar>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={() => setFilterAnchorEl(null)}
        PaperProps={{
          sx: { width: 300, p: 2 },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Lọc theo cột
        </Typography>
        {columns
          .filter((col) => col.filterable)
          .map((column) => (
            <Box key={String(column.key)} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {column.header}
              </Typography>
              {column.filterType === "select" && column.filterOptions ? (
                <FormControl fullWidth size="small">
                  <Select
                    value={columnFilters[String(column.key)] || "all"}
                    onChange={(e) => {
                      const newFilters = { ...columnFilters };
                      if (e.target.value === "all") {
                        delete newFilters[String(column.key)];
                      } else {
                        newFilters[String(column.key)] = e.target.value;
                      }
                      handleColumnFilterChange(newFilters);
                    }}
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    {column.filterOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  placeholder={`Lọc ${column.header.toLowerCase()}...`}
                  value={columnFilters[String(column.key)] || ""}
                  onChange={(e) => {
                    const newFilters = {
                      ...columnFilters,
                      [String(column.key)]: e.target.value,
                    };
                    handleColumnFilterChange(newFilters);
                  }}
                  size="small"
                  fullWidth
                />
              )}
            </Box>
          ))}
      </Menu>

      {/* Selected rows info */}
      {selectedRows.size > 0 && (
        <Box
          sx={{
            p: 2,
            bgcolor: "primary.light",
            color: "primary.contrastText",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">
            Đã chọn {selectedRows.size} trong số{" "}
            {pagination?.totalItems || displayData.length} dòng.
          </Typography>
          <Chip
            label="Bỏ chọn"
            onClick={() => setSelectedRows(new Set())}
            size="small"
            sx={{ bgcolor: "white", color: "primary.main" }}
          />
        </Box>
      )}

      {/* Table */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    selectedRows.size === displayData.length &&
                    displayData.length > 0
                  }
                  indeterminate={
                    selectedRows.size > 0 &&
                    selectedRows.size < displayData.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  style={{ width: column.width }}
                  sortDirection={
                    sortConfig?.key === column.key
                      ? sortConfig.direction
                      : false
                  }
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortConfig?.key === column.key}
                      direction={
                        sortConfig?.key === column.key
                          ? sortConfig.direction
                          : "asc"
                      }
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                    </TableSortLabel>
                  ) : (
                    column.header
                  )}
                </TableCell>
              ))}
              <TableCell padding="checkbox">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  <Typography>Đang tải...</Typography>
                </TableCell>
              </TableRow>
            ) : displayData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 2} align="center">
                  <Typography>Không có dữ liệu</Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    hover
                    key={row.id}
                    selected={isItemSelected}
                    sx={{
                      bgcolor: isItemSelected ? "action.selected" : "inherit",
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(e) =>
                          handleSelectRow(row.id, e.target.checked)
                        }
                      />
                    </TableCell>
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key])}
                      </TableCell>
                    ))}
                    <TableCell padding="checkbox">
                      <IconButton size="small">
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.totalItems}
          page={pagination.currentPage - 1} // MUI uses 0-based indexing
          rowsPerPage={pagination.pageSize}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Dòng trên trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      )}
    </Paper>
  );
}
