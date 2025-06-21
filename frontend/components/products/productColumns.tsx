import { Button } from "@/components/ui/button";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Product } from "@/lib/api/products";

const CurrencyCell = ({ value }: { value: number }) => (
  <span className="font-mono font-semibold">${value.toLocaleString()}</span>
);

interface ProductColumnsProps {
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const getProductColumns = ({
  onEdit,
  onDelete,
}: ProductColumnsProps): GridColDef<Product>[] => [
  {
    field: "sku",
    headerName: "SKU",
    width: 120,
    renderCell: (params) => (
      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">
        {params.value}
      </code>
    ),
  },
  {
    field: "upc",
    headerName: "UPC",
    width: 140,
    renderCell: (params) => (
      <span className="text-sm font-mono">{params.value}</span>
    ),
  },
  {
    field: "wmid",
    headerName: "WMID",
    width: 120,
    renderCell: (params) => (
      <span className="text-sm font-mono">{params.value}</span>
    ),
  },
  {
    field: "name",
    headerName: "Tên sản phẩm",
    width: 250,
    renderCell: (params) => (
      <div className="font-medium text-sm leading-tight py-1 max-w-48 truncate h-full flex items-center">
        {params.value}
      </div>
    ),
  },
  {
    field: "sitePrice",
    headerName: "Giá gốc",
    width: 120,
    renderCell: (params) => <CurrencyCell value={params.value} />,
  },
  {
    field: "sellingPrice",
    headerName: "Giá bán",
    width: 120,
    renderCell: (params) => <CurrencyCell value={params.value} />,
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 120,
    renderCell: (params) => (
      <span className="text-sm">
        {params.value ? new Date(params.value).toLocaleDateString("vi-VN") : ""}
      </span>
    ),
  },
  {
    field: "actions",
    type: "actions",
    headerName: "Thao tác",
    width: 120,
    getActions: (params) => [
      <GridActionsCellItem
        icon={
          <Button size="sm" variant="outline">
            Sửa
          </Button>
        }
        label="Sửa"
        onClick={() => onEdit(params.row)}
        key="edit"
        showInMenu={false}
      />,
      <GridActionsCellItem
        icon={
          <Button size="sm" variant="destructive">
            Xóa
          </Button>
        }
        label="Xóa"
        onClick={() => onDelete(params.row)}
        key="delete"
        showInMenu={false}
      />,
    ],
  },
];
