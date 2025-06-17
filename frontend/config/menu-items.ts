import {
  Users,
  Package,
  ShoppingCart,
  CheckSquare,
  BarChart3,
  Settings,
  Home,
  UserCog,
} from "lucide-react";

export interface MenuItem {
  title: string;
  url: string;
  icon: any;
  color: string;
  bgColor: string;
  permission: string;
}

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
    permission: "view_dashboard",
  },
  {
    title: "Quản lý users",
    url: "/users",
    icon: UserCog,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "hover:bg-cyan-50 dark:hover:bg-cyan-900/20",
    permission: "manage_users",
  },
  {
    title: "Quản lý tài khoản",
    url: "/accounts",
    icon: Users,
    color: "text-green-600 dark:text-green-400",
    bgColor: "hover:bg-green-50 dark:hover:bg-green-900/20",
    permission: "manage_accounts",
  },
  {
    title: "Quản lý sản phẩm",
    url: "/products",
    icon: Package,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
    permission: "manage_products",
  },
  {
    title: "Quản lý đơn hàng",
    url: "/orders",
    icon: ShoppingCart,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "hover:bg-orange-50 dark:hover:bg-orange-900/20",
    permission: "manage_orders",
  },
  {
    title: "Quản lý tác vụ",
    url: "/tasks",
    icon: CheckSquare,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
    permission: "manage_tasks",
  },
  {
    title: "Báo cáo",
    url: "/reports",
    icon: BarChart3,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
    permission: "view_reports",
  },
  {
    title: "Cài đặt",
    url: "/settings",
    icon: Settings,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "hover:bg-gray-50 dark:hover:bg-gray-800",
    permission: "manage_settings",
  },
];
