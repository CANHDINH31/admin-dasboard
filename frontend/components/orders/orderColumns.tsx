import { Button } from "@/components/ui/button";
import { Order } from "@/lib/api";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";

const CurrencyCell = ({ value }: { value: number }) => (
  <span className="font-mono font-semibold">${value.toLocaleString()}</span>
);

const DateCell = ({ value }: { value: Date | string }) => (
  <span className="text-sm">
    {value ? new Date(value).toLocaleDateString("vi-VN") : ""}
  </span>
);

interface OrderColumnsProps {
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

export const getOrderColumns = ({
  onEdit,
  onDelete,
}: OrderColumnsProps): GridColDef<Order>[] => [
  {
    field: "orderNumber",
    headerName: "Số đơn hàng",
    width: 140,
    renderCell: (params) => (
      <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">
        {params.value}
      </code>
    ),
  },
  {
    field: "poNumber",
    headerName: "PO Number",
    width: 120,
    renderCell: (params) => (
      <span className="text-sm font-mono">{params.value}</span>
    ),
  },
  {
    field: "orderNumEmail",
    headerName: "Email đơn hàng",
    width: 180,
    renderCell: (params) => <span className="text-sm">{params.value}</span>,
  },
  {
    field: "sku",
    headerName: "SKU",
    width: 120,
    renderCell: (params) => (
      <span className="text-sm font-mono">{params.value}</span>
    ),
  },
  {
    field: "name",
    headerName: "Tên sản phẩm",
    width: 200,
    renderCell: (params) => (
      <div className="font-medium text-sm leading-tight py-1 max-w-48 truncate h-full flex items-center">
        {params.value}
      </div>
    ),
  },
  {
    field: "quantity",
    headerName: "Số lượng",
    width: 100,
    renderCell: (params) => (
      <span className="text-sm font-medium">{params.value}</span>
    ),
  },
  {
    field: "sellingPrice",
    headerName: "Giá bán",
    width: 120,
    renderCell: (params) => <CurrencyCell value={params.value} />,
  },
  {
    field: "sourcingPrice",
    headerName: "Giá mua",
    width: 120,
    renderCell: (params) => <CurrencyCell value={params.value} />,
  },
  {
    field: "netProfit",
    headerName: "Lợi nhuận",
    width: 120,
    renderCell: (params) => (
      <span
        className={`font-mono font-semibold ${
          params.value && params.value > 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        ${params.value?.toLocaleString() || "0"}
      </span>
    ),
  },
  {
    field: "trackingStatus",
    headerName: "Trạng thái",
    width: 120,
    renderCell: (params) => {
      const statusColors: { [key: string]: string } = {
        "In Transit":
          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        Delivered:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        Pending:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        Lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      };
      const colorClass =
        statusColors[params.value] ||
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      return (
        <span className={`text-xs px-2 py-1 rounded-full ${colorClass}`}>
          {params.value}
        </span>
      );
    },
  },
  {
    field: "orderDate",
    headerName: "Ngày đặt",
    width: 120,
    renderCell: (params) => <DateCell value={params.value} />,
  },
  {
    field: "shipBy",
    headerName: "Ngày giao",
    width: 120,
    renderCell: (params) => <DateCell value={params.value} />,
  },
  {
    field: "customerShippingAddress",
    headerName: "Địa chỉ giao hàng",
    width: 200,
    renderCell: (params) => (
      <div className="text-sm leading-tight py-1 max-w-48 truncate h-full flex items-center">
        {params.value}
      </div>
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
