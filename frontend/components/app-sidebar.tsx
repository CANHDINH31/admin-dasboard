"use client"

import { Users, Package, ShoppingCart, CheckSquare, BarChart3, Settings, Home, LogOut, UserCog } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
  {
    title: "Quản lý users",
    url: "/users",
    icon: UserCog,
    color: "text-cyan-600 dark:text-cyan-400",
    bgColor: "hover:bg-cyan-50 dark:hover:bg-cyan-900/20",
  },
  {
    title: "Quản lý tài khoản",
    url: "/accounts",
    icon: Users,
    color: "text-green-600 dark:text-green-400",
    bgColor: "hover:bg-green-50 dark:hover:bg-green-900/20",
  },
  {
    title: "Quản lý sản phẩm",
    url: "/products",
    icon: Package,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "hover:bg-purple-50 dark:hover:bg-purple-900/20",
  },
  {
    title: "Quản lý đơn hàng",
    url: "/orders",
    icon: ShoppingCart,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "hover:bg-orange-50 dark:hover:bg-orange-900/20",
  },
  {
    title: "Quản lý tác vụ",
    url: "/tasks",
    icon: CheckSquare,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "hover:bg-pink-50 dark:hover:bg-pink-900/20",
  },
  {
    title: "Báo cáo",
    url: "/reports",
    icon: BarChart3,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
  },
  {
    title: "Cài đặt",
    url: "/settings",
    icon: Settings,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "hover:bg-gray-50 dark:hover:bg-gray-800",
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
            <p className="text-sm text-muted-foreground">Marketplace Manager</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu chính
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={`transition-all duration-200 ${item.bgColor} py-3`}>
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                      <span className="font-medium text-base">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-base font-medium truncate">Admin User</p>
              <p className="text-sm text-muted-foreground truncate">admin@example.com</p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
