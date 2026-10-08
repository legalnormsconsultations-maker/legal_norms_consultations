import {
  Activity,
  AlertTriangle,
  Clock,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { DashboardService } from "@/services/dashboard.service";

export default async function DashboardPage() {
  const { metrics, recentEvents, isConnected } =
    await DashboardService.getOverviewData();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      {!isConnected && (
        <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-warning mr-3" />
            <p className="text-sm text-warning-foreground dark:text-warning font-medium">
              <strong>Database Not Connected:</strong> Please configure your{" "}
              <code>DATABASE_URL</code> in <code>.env.local</code> and run{" "}
              <code>pnpm drizzle-kit push</code>. Showing zero-state fallback.
            </p>
          </div>
        </div>
      )}
      <div>
        <h1 className="text-2xl font-heading font-semibold text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back. Here is your regulatory and portfolio summary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monitored Drugs"
          value={metrics.monitoredDrugs.toString()}
          trend={isConnected ? "Live DB Count" : "Pending connection"}
          trendUp={true}
          icon={<Activity className="text-orange-500" size={24} />}
        />
        <MetricCard
          title="Active Alerts"
          value={metrics.activeAlerts.toString()}
          trend={isConnected ? "Live DB Count" : "Pending connection"}
          trendUp={metrics.activeAlerts === 0}
          icon={<AlertTriangle className="text-amber-500" size={24} />}
        />
        <MetricCard
          title="Documents Scanned"
          value={metrics.documentsScanned.toString()}
          trend={isConnected ? "Live DB Count" : "Pending connection"}
          trendUp={true}
          icon={<FileCheck className="text-emerald-500" size={24} />}
        />
        <MetricCard
          title="Portfolio Views"
          value={metrics.portfolioViews.toString()}
          trend="Stubbed Metric"
          trendUp={true}
          icon={<TrendingUp className="text-purple-500" size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/50">
              <h2 className="font-semibold text-foreground">
                Recent Regulatory Events
              </h2>
              <button
                type="button"
                className="text-sm text-primary-600 font-medium hover:text-primary-700"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-border">
              {recentEvents.length === 0 ? (
                <div className="px-6 py-8 text-center text-muted-foreground text-sm">
                  No recent regulatory events recorded.
                </div>
              ) : (
                recentEvents.map((event) => (
                  <EventRow
                    key={event.id}
                    drug={event.drugName || "Unknown"}
                    authority={event.authority || "Unknown"}
                    event={event.event || "Regulatory Update"}
                    date={
                      event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "Unknown"
                    }
                    urgent={
                      event.type?.toLowerCase().includes("safety") || false
                    }
                  />
                ))
              )}
            </div>
          </section>

          <section className="bg-card rounded-xl border border-border overflow-hidden shadow-sm p-6">
            <h2 className="font-semibold text-foreground mb-4">
              Portfolio Activity
            </h2>
            <div className="flex items-center justify-center h-48 border-2 border-dashed border-border rounded-lg text-neutral-400 bg-secondary/50">
              <p className="text-sm">
                Connect your portfolio items to see activity history.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-primary text-primary-foreground rounded-xl shadow-sm p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FileCheck size={100} />
            </div>
            <h2 className="font-semibold text-lg mb-2 relative z-10">
              India regulatory pathways
            </h2>
            <p className="text-primary-foreground/80 text-sm mb-6 relative z-10">
              Open a product-specific checklist across drugs, devices, food,
              cosmetics, and other regulated categories.
            </p>
            <Link
              href="/admin/dashboard/import-compliance"
              className="relative z-10 flex w-full items-center justify-center rounded-lg bg-background py-2.5 font-semibold text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Explore pathways
            </Link>
          </section>

          <section className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock size={18} className="text-muted-foreground" />
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-success shrink-0" />
                <div>
                  <p className="text-foreground font-medium">
                    EMA Database Sync Completed
                  </p>
                  <p className="text-muted-foreground">14 minutes ago</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-info shrink-0" />
                <div>
                  <p className="text-foreground font-medium">
                    Weekly Report Generated
                  </p>
                  <p className="text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  trend,
  trendUp,
  icon,
}: {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: ReactNode;
}) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <div className="p-2 bg-secondary rounded-lg">{icon}</div>
      </div>
      <div className="mt-auto">
        <p className="text-3xl font-bold text-foreground tracking-tight">
          {value}
        </p>
        <p
          className={`text-sm mt-1 font-medium ${trendUp ? "text-emerald-600" : "text-amber-600"}`}
        >
          {trend}
        </p>
      </div>
    </div>
  );
}

function EventRow({
  drug,
  authority,
  event,
  date,
  urgent,
}: {
  drug: string;
  authority: string;
  event: string;
  date: string;
  urgent: boolean;
}) {
  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-secondary transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
            authority === "FDA"
              ? "bg-info/10 text-info dark:bg-info/20 dark:text-info-foreground"
              : authority === "EMA"
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
          }`}
        >
          {authority}
        </div>
        <div>
          <p className="text-foreground font-medium flex items-center gap-2">
            {drug}
            {urgent && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground uppercase tracking-wide">
                Urgent
              </span>
            )}
          </p>
          <p className="text-muted-foreground text-sm">{event}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-muted-foreground text-sm">{date}</p>
      </div>
    </div>
  );
}
