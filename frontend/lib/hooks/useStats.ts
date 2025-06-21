import { useState, useEffect } from "react";
import { statsApi, DashboardStats, ChartData } from "../api/stats";

export const useStats = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statsApi.getDashboardStats();
      setDashboardStats(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard stats"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      setError(null);
      const data = await statsApi.getChartData();
      setChartData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch chart data"
      );
    }
  };

  const refreshStats = async () => {
    await Promise.all([fetchDashboardStats(), fetchChartData()]);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return {
    dashboardStats,
    chartData,
    loading,
    error,
    refreshStats,
  };
};
