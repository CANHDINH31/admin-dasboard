import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Account } from "@/lib/hooks/useAccounts";

const getMarketplaceBadge = (marketplace: string) => {
  const colors = {
    eBay: "bg-blue-500 text-white",
    Amazon: "bg-orange-500 text-white",
    Walmart: "bg-green-500 text-white",
  };
  return (
    <Badge className={colors[marketplace as keyof typeof colors] || ""}>
      {marketplace}
    </Badge>
  );
};

const getStatusBadge = (status: string) => {
  const variants = {
    active: "default",
    inactive: "secondary",
    suspended: "destructive",
  } as const;
  return (
    <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  );
};

interface AccountColumnsProps {
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
}

export const getAccountColumns = ({
  onEdit,
  onDelete,
}: AccountColumnsProps): GridColDef<Account>[] => [
  {
    field: "marketplace",
    headerName: "Marketplace",
    width: 120,
    renderCell: (params) => getMarketplaceBadge(params.value),
  },
  {
    field: "accName",
    headerName: "Tên tài khoản",
    width: 180,
    renderCell: (params) => (
      <span className="font-semibold">{params.value}</span>
    ),
  },
  {
    field: "profileName",
    headerName: "Profile Name",
    width: 140,
    renderCell: (params) => (
      <span className="truncate block max-w-[120px]">{params.value}</span>
    ),
  },
  {
    field: "sheetID",
    headerName: "Sheet ID",
    width: 140,
    renderCell: (params) => (
      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded truncate block max-w-[120px]">
        {params.value}
      </code>
    ),
  },
  {
    field: "accountInfo",
    headerName: "Thông tin",
    width: 180,
    renderCell: (params) => (
      <span className="text-sm text-gray-600 truncate max-w-[140px] block">
        {params.value}
      </span>
    ),
  },
  {
    field: "proxy",
    headerName: "Proxy",
    width: 120,
    renderCell: (params) => (
      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded truncate block max-w-[100px]">
        {params.value}
      </code>
    ),
  },
  {
    field: "clientID",
    headerName: "Client ID",
    width: 140,
    renderCell: (params) => (
      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded truncate block max-w-[120px]">
        {params.value}
      </code>
    ),
  },
  {
    field: "clientSecret",
    headerName: "Client Secret",
    width: 140,
    renderCell: (params) => {
      const value = params.value || "";
      const masked =
        value.length > 4
          ? "*".repeat(value.length - 4) + value.slice(-4)
          : value;
      return (
        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded truncate block max-w-[120px]">
          {masked}
        </code>
      );
    },
  },
  {
    field: "telegramId",
    headerName: "Telegram ID",
    width: 120,
    renderCell: (params) => (
      <span className="text-blue-600 dark:text-blue-400 truncate block max-w-[100px]">
        {params.value}
      </span>
    ),
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 120,
    renderCell: (params) => getStatusBadge(params.value),
  },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 110,
  },
  {
    field: "lastSync",
    headerName: "Sync cuối",
    width: 140,
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
