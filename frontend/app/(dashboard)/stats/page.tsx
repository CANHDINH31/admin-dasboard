"use client";

import React from "react";
import { DetailedStats } from "@/components/dashboard/DetailedStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { TopProducts } from "@/components/dashboard/TopProducts";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { useStats } from "@/lib/hooks/useStats";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, BarChart3 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StatsPage() {
  const { dashboardStats, chartData, loading, error, refreshStats } =
    useStats();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
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
    );
  }

  if (!dashboardStats || !chartData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available</p>
        <Button onClick={refreshStats} className="mt-2">
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Detailed Statistics
          </h1>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights for your business
          </p>
        </div>
        <Button onClick={refreshStats} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Stats</TabsTrigger>
          <TabsTrigger value="charts">Charts & Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <DashboardCharts chartData={chartData} stats={dashboardStats} />
            </div>
            <div className="space-y-6">
              <TopProducts
                topProducts={dashboardStats.revenueStats.topProducts}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <DetailedStats stats={dashboardStats} />
        </TabsContent>

        <TabsContent value="charts" className="space-y-6">
          <DashboardCharts chartData={chartData} stats={dashboardStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
