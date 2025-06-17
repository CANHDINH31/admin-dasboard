"use client";

import {
  Users,
  Package,
  ShoppingCart,
  CheckSquare,
  BarChart3,
  Settings,
  Home,
  LogOut,
  UserCog,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { UserInfo } from "./user-info";
import { useEffect, useState } from "react";
import Link from "next/link";
import { menuItems } from "../config/menu-items";

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
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [visibleMenuItems, setVisibleMenuItems] = useState(menuItems);

  useEffect(() => {
    try {
      const userData = document.cookie
        .split("; ")
        .find((row) => row.startsWith("user="))
        ?.split("=")[1];

      if (userData) {
        const user = JSON.parse(decodeURIComponent(userData));
        const filteredItems = menuItems.filter((item) =>
          user.permissions.includes(item.permission)
        );
        setVisibleMenuItems(filteredItems);
      }
    } catch (error) {
      console.error("Error reading user data from cookies:", error);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("user");
    toast.success("Đăng xuất thành công");
    router.push("/login");
  };

  return (
    <Sidebar>
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <UserInfo />
        </div>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <BarChart3 className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </span>
              <p className="text-sm text-muted-foreground">
                Marketplace Manager
              </p>
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
                {visibleMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`transition-all duration-200 ${item.bgColor} py-3`}
                    >
                      <Link
                        href={item.url}
                        className={`flex items-center gap-3 ${
                          pathname === item.url
                            ? `${item.color}`
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                        <span className="font-medium text-base">
                          {item.title}
                        </span>
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
                <p className="text-sm text-muted-foreground truncate">
                  admin@example.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </SidebarFooter>

        <SidebarRail />
      </div>
    </Sidebar>
  );
}
