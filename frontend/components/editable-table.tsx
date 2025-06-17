"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Plus, Trash2, Download } from "lucide-react"

interface CellData {
  value: string
  formula?: string
  type?: "text" | "number" | "formula"
}

interface EditableTableProps {
  data: CellData[][]
  headers: string[]
  onDataChange?: (data: CellData[][]) => void
  onSave?: (data: CellData[][]) => void
}

export function EditableTable({ data: initialData, headers, onDataChange, onSave }: EditableTableProps) {
  const [data, setData] = useState<CellData[][]>(initialData)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null)
  const [formulaBarValue, setFormulaBarValue] = useState("")
  const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({})

  useEffect(() => {
    if (selectedCell) {
      const cellData = data[selectedCell.row]?.[selectedCell.col]
      setFormulaBarValue(cellData?.formula || cellData?.value || "")
    }
  }, [selectedCell, data])

  const getCellKey = (row: number, col: number) => `${row}-${col}`

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col })
    setEditingCell(null)
  }

  const handleCellDoubleClick = (row: number, col: number) => {
    setEditingCell({ row, col })
    setSelectedCell({ row, col })
    setTimeout(() => {
      const input = inputRefs.current[getCellKey(row, col)]
      if (input) {
        input.focus()
        input.select()
      }
    }, 0)
  }

  const handleCellChange = (row: number, col: number, value: string) => {
    const newData = [...data]
    if (!newData[row]) newData[row] = []

    const cellData: CellData = { value }

    // Check if it's a formula
    if (value.startsWith("=")) {
      cellData.formula = value
      cellData.type = "formula"
      cellData.value = evaluateFormula(value, newData)
    } else if (!isNaN(Number(value)) && value !== "") {
      cellData.type = "number"
    } else {
      cellData.type = "text"
    }

    newData[row][col] = cellData
    setData(newData)
    onDataChange?.(newData)
  }

  const evaluateFormula = (formula: string, tableData: CellData[][]): string => {
    try {
      // Remove the = sign
      let expression = formula.substring(1)

      // Replace cell references (A1, B2, etc.) with actual values
      expression = expression.replace(/([A-Z]+)(\d+)/g, (match, col, row) => {
        const colIndex = col.charCodeAt(0) - 65 // A=0, B=1, etc.
        const rowIndex = Number.parseInt(row) - 1
        const cellValue = tableData[rowIndex]?.[colIndex]?.value || "0"
        return isNaN(Number(cellValue)) ? "0" : cellValue
      })

      // Basic math operations
      expression = expression.replace(/SUM$$([^)]+)$$/g, (match, range) => {
        const values = range.split(",").map((v: string) => Number(v.trim()) || 0)
        return values.reduce((sum: number, val: number) => sum + val, 0).toString()
      })

      expression = expression.replace(/AVG$$([^)]+)$$/g, (match, range) => {
        const values = range.split(",").map((v: string) => Number(v.trim()) || 0)
        const avg = values.reduce((sum: number, val: number) => sum + val, 0) / values.length
        return avg.toString()
      })

      // Evaluate basic math expressions
      const result = Function(`"use strict"; return (${expression})`)()
      return result.toString()
    } catch (error) {
      return "#ERROR"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === "Enter") {
      setEditingCell(null)
      if (row < data.length - 1) {
        setSelectedCell({ row: row + 1, col })
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      setEditingCell(null)
      if (col < headers.length - 1) {
        setSelectedCell({ row, col: col + 1 })
      }
    } else if (e.key === "Escape") {
      setEditingCell(null)
    }
  }

  const addRow = () => {
    const newRow: CellData[] = headers.map(() => ({ value: "", type: "text" }))
    setData([...data, newRow])
  }

  const deleteRow = (rowIndex: number) => {
    const newData = data.filter((_, index) => index !== rowIndex)
    setData(newData)
    onDataChange?.(newData)
  }

  const handleFormulaBarChange = (value: string) => {
    setFormulaBarValue(value)
    if (selectedCell) {
      handleCellChange(selectedCell.row, selectedCell.col, value)
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((_, colIndex) => row[colIndex]?.value || "").join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "table-data.csv"
    a.click()
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-800">
        <Button onClick={addRow} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Thêm dòng
        </Button>
        <Button onClick={() => onSave?.(data)} size="sm" variant="outline">
          <Save className="h-4 w-4 mr-1" />
          Lưu
        </Button>
        <Button onClick={exportToCSV} size="sm" variant="outline">
          <Download className="h-4 w-4 mr-1" />
          Xuất CSV
        </Button>
        <div className="ml-auto text-sm text-gray-600">
          {selectedCell && `Ô đã chọn: ${String.fromCharCode(65 + selectedCell.col)}${selectedCell.row + 1}`}
        </div>
      </div>

      {/* Formula Bar */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium min-w-[60px]">Công thức:</span>
        <Input
          value={formulaBarValue}
          onChange={(e) => handleFormulaBarChange(e.target.value)}
          className="font-mono"
          placeholder="Nhập giá trị hoặc công thức (=A1+B1)"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="excel-table w-full">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="w-12 p-2 border text-center">#</th>
              {headers.map((header, index) => (
                <th key={index} className="p-2 border text-left font-medium">
                  {header}
                </th>
              ))}
              <th className="w-16 p-2 border text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="p-2 border text-center bg-gray-50 dark:bg-gray-800 font-mono text-sm">{rowIndex + 1}</td>
                {headers.map((_, colIndex) => {
                  const cellData = row[colIndex] || { value: "", type: "text" }
                  const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                  const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex

                  return (
                    <td
                      key={colIndex}
                      className={`excel-cell p-0 ${isSelected ? "selected" : ""} ${isEditing ? "editing" : ""}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                    >
                      {isEditing ? (
                        <input
                          ref={(el) => {
                            if (el) inputRefs.current[getCellKey(rowIndex, colIndex)] = el
                          }}
                          value={cellData.formula || cellData.value}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                          onBlur={() => setEditingCell(null)}
                          className="w-full h-full p-2 border-none outline-none"
                        />
                      ) : (
                        <div className="p-2 min-h-[40px] cursor-cell">
                          {cellData.type === "number" ? (
                            <span className="text-right block">{cellData.value}</span>
                          ) : cellData.type === "formula" ? (
                            <span className="text-blue-600 dark:text-blue-400">{cellData.value}</span>
                          ) : (
                            cellData.value
                          )}
                        </div>
                      )}
                    </td>
                  )
                })}
                <td className="p-2 border text-center">
                  <Button
                    onClick={() => deleteRow(rowIndex)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Help */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Hướng dẫn:</strong>
        </p>
        <p>• Click đúp để chỉnh sửa ô • Enter: xuống dòng • Tab: sang ô tiếp theo</p>
        <p>• Công thức: =A1+B1, =SUM(A1,B1,C1), =AVG(A1,B1,C1)</p>
        <p>• Tham chiếu ô: A1, B2, C3... (A=cột 1, B=cột 2...)</p>
      </div>
    </div>
  )
}
