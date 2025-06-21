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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
      <span className="text-sm truncate block max-w-[120px] flex items-center justify-center w-full h-full">
        {params.value}
      </span>
    ),
  },
  {
    field: "accountInfo",
    headerName: "Thông tin",
    width: 180,
    renderCell: (params) => (
      <span className="text-sm truncate max-w-[140px] block flex items-center justify-center w-full h-full">
        {params.value}
      </span>
    ),
  },
  {
    field: "proxy",
    headerName: "Proxy",
    width: 120,
    renderCell: (params) => (
      <span className="text-sm truncate block max-w-[100px] flex items-center justify-center w-full h-full">
        {params.value}
      </span>
    ),
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
    renderCell: (params) => (
      <span className="text-sm">{formatDate(params.value)}</span>
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
