import { DashboardRepository } from "@/repositories/dashboard.repository";

export const DashboardService = {
  async getOverviewData() {
    try {
      const [metrics, recentEvents] = await Promise.all([
        DashboardRepository.getMetrics(),
        DashboardRepository.getRecentEvents(5),
      ]);

      return {
        metrics,
        recentEvents,
        isConnected: true,
      };
    } catch (error) {
      console.error("Database connection failed for dashboard:", error);
      // Fallback zero-state until DB is connected
      return {
        metrics: {
          monitoredDrugs: 0,
          activeAlerts: 0,
          documentsScanned: 0,
          portfolioViews: 0,
        },
        recentEvents: [],
        isConnected: false,
      };
    }
  },
};
