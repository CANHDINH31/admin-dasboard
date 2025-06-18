export interface PermissionConfig {
  label: string;
  color: string;
  icon: string;
}

export const permissionConfig: Record<string, PermissionConfig> = {
  view_dashboard: {
    label: "Dashboard",
    color:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    icon: "📊",
  },
  manage_users: {
    label: "Users",
    color:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
    icon: "👥",
  },
  manage_accounts: {
    label: "Accounts",
    color:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
    icon: "🔐",
  },
  manage_products: {
    label: "Products",
    color:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
    icon: "📦",
  },
  manage_orders: {
    label: "Orders",
    color:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
    icon: "🛒",
  },
  manage_tasks: {
    label: "Tasks",
    color:
      "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
    icon: "✅",
  },
};

// Default config for unknown permissions
export const defaultPermissionConfig: PermissionConfig = {
  label: "Unknown",
  color:
    "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600",
  icon: "🔧",
};

// Helper function to get permission config
export const getPermissionConfig = (permission: string): PermissionConfig => {
  return (
    permissionConfig[permission] || {
      ...defaultPermissionConfig,
      label: permission,
    }
  );
};

// All available permissions
export const AVAILABLE_PERMISSIONS = Object.keys(permissionConfig);

// Permission groups for better organization
export const PERMISSION_GROUPS = {
  VIEW: ["view_dashboard"],
  MANAGEMENT: [
    "manage_users",
    "manage_accounts",
    "manage_products",
    "manage_orders",
    "manage_tasks",
  ],
};
