import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export const getAccountColumns = ({ onEdit, onDelete }: any) => [
  {
    field: "marketplace",
    headerName: "Marketplace",
    width: 120,
    renderCell: (params: any) => getMarketplaceBadge(params.value),
  },
  {
    field: "accName",
    headerName: "Tên tài khoản",
    width: 180,
    renderCell: (params: any) => (
      <span className="font-semibold">{params.value}</span>
    ),
  },
  {
    field: "profileName",
    headerName: "Profile Name",
    width: 140,
  },
  {
    field: "accountInfo",
    headerName: "Thông tin",
    width: 180,
    renderCell: (params: any) => (
      <span className="text-sm text-gray-600 truncate max-w-32 block">
        {params.value}
      </span>
    ),
  },
  {
    field: "proxy",
    headerName: "Proxy",
    width: 120,
    renderCell: (params: any) => (
      <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
        {params.value}
      </code>
    ),
  },
  {
    field: "telegramId",
    headerName: "Telegram",
    width: 120,
    renderCell: (params: any) => (
      <span className="text-blue-600 dark:text-blue-400">{params.value}</span>
    ),
  },
  {
    field: "status",
    headerName: "Trạng thái",
    width: 120,
    renderCell: (params: any) => getStatusBadge(params.value),
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
    getActions: (params: any) => [
      <Button
        size="sm"
        variant="outline"
        onClick={() => onEdit(params.row)}
        key="edit"
      >
        Sửa
      </Button>,
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onDelete(params.row)}
        key="delete"
      >
        Xóa
      </Button>,
    ],
    renderCell: (params: any) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => onEdit(params.row)}>
          Sửa
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(params.row)}
        >
          Xóa
        </Button>
      </div>
    ),
  },
];
