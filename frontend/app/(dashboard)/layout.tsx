import type React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex-shrink-0 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 min-h-screen overflow-x-auto max-w-full">
        {children}
      </main>
    </SidebarProvider>
  );
}
