"use client";

import React from "react";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useStats } from "@/lib/hooks/useStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardPage() {
  const { dashboardStats, chartData, loading, error, refreshStats } =
    useStats();

  if (loading) {
    return (
      <SidebarInset>
        <DashboardSkeleton />
      </SidebarInset>
    );
  }

  if (error) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={refreshStats}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </SidebarInset>
    );
  }

  if (!dashboardStats || !chartData) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
          <div className="text-center py-8">
            <p className="text-muted-foreground">No data available</p>
            <Button onClick={refreshStats} className="mt-2">
              Refresh
            </Button>
          </div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white dark:bg-gray-900 px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6 bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Overview
            </h2>
            <p className="text-muted-foreground">
              Overview of your business metrics and performance
            </p>
          </div>
          <Button onClick={refreshStats} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <DashboardStats stats={dashboardStats} />

        {/* Charts and Top Products */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DashboardCharts chartData={chartData} stats={dashboardStats} />
          </div>
          <div className="space-y-6">
            <TopProducts
              topProducts={dashboardStats.revenueStats.topProducts}
            />

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Add New Product
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Create Order
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Manage Accounts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
