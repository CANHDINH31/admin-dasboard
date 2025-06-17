"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Edit, Trash2 } from "lucide-react"

export interface Column<T> {
  key: keyof T
  header: string
  sortable?: boolean
  filterable?: boolean
  filterType?: "text" | "select" | "number" | "date"
  filterOptions?: string[]
  render?: (value: any, row: T) => React.ReactNode
  width?: string
}

interface AdvancedTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  onExport?: () => void
  searchPlaceholder?: string
}

export function AdvancedTable<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
  onExport,
  searchPlaceholder = "Tìm kiếm...",
}: AdvancedTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({})
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = data

    // Global filter
    if (globalFilter) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) => String(value).toLowerCase().includes(globalFilter.toLowerCase())),
      )
    }

    // Column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        // Thêm check cho "all"
        filtered = filtered.filter((row) =>
          String(row[key as keyof T])
            .toLowerCase()
            .includes(value.toLowerCase()),
        )
      }
    })

    return filtered
  }, [data, globalFilter, columnFilters])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key: keyof T) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return current.direction === "asc" ? { key, direction: "desc" } : null
      }
      return { key, direction: "asc" }
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedData.map((row) => row.id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (id: string | number, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  const getSortIcon = (key: keyof T) => {
    if (sortConfig?.key !== key) return <ArrowUpDown className="h-4 w-4" />
    return sortConfig.direction === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Bộ lọc
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Lọc theo cột</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns
                .filter((col) => col.filterable)
                .map((column) => (
                  <div key={String(column.key)} className="p-2">
                    <label className="text-sm font-medium mb-1 block">{column.header}</label>
                    {column.filterType === "select" && column.filterOptions ? (
                      <Select
                        value={columnFilters[String(column.key)] || "all"} // Updated default value
                        onValueChange={(value) => {
                          if (value === "all") {
                            // Remove filter for this column
                            setColumnFilters((prev) => {
                              const newFilters = { ...prev }
                              delete newFilters[String(column.key)]
                              return newFilters
                            })
                          } else {
                            setColumnFilters((prev) => ({ ...prev, [String(column.key)]: value }))
                          }
                        }}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Chọn..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem> // Updated value prop
                          {column.filterOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder={`Lọc ${column.header.toLowerCase()}...`}
                        value={columnFilters[String(column.key)] || ""}
                        onChange={(e) =>
                          setColumnFilters((prev) => ({ ...prev, [String(column.key)]: e.target.value }))
                        }
                        className="h-8"
                      />
                    )}
                  </div>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">
          {onExport && (
            <Button onClick={onExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất dữ liệu
            </Button>
          )}
        </div>
      </div>

      {/* Selected rows info */}
      {selectedRows.size > 0 && (
        <div className="flex items-center justify-between rounded-md bg-blue-50 dark:bg-blue-900/20 p-3">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            Đã chọn {selectedRows.size} trong số {sortedData.length} dòng.
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedRows(new Set())}>
            Bỏ chọn
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border bg-white dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={String(column.key)} className={column.width}>
                  {column.sortable ? (
                    <Button variant="ghost" onClick={() => handleSort(column.key)} className="h-auto p-0 font-semibold">
                      {column.header}
                      {getSortIcon(column.key)}
                    </Button>
                  ) : (
                    <span className="font-semibold">{column.header}</span>
                  )}
                </TableHead>
              ))}
              <TableHead className="w-16">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                key={row.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedRows.has(row.id) ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={(checked) => handleSelectRow(row.id, checked as boolean)}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                  </TableCell>
                ))}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(row)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem onClick={() => onDelete(row)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Dòng trên trang</p>
          <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="h-8 w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Trang {currentPage} / {totalPages}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              {"<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
