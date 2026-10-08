import { db } from "@/db";
import { users, drugs, regulatorySignals, leads } from "@/db/schema";
import { count, eq, ne, desc } from "drizzle-orm";
import { ArrowUpRight, Activity, Users, AlertTriangle, UserCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | Regulatory Platform",
};

export default async function AdminDashboardPage() {
  // Parallel fetch for dashboard metrics
  const [
    [{ totalUsers }],
    [{ activeDrugs }],
    [{ pendingSignals }],
    recentLeads,
  ] = await Promise.all([
    db.select({ totalUsers: count() }).from(users),
    // Assuming active drugs might have a status, but for now just count all drugs
    db.select({ activeDrugs: count() }).from(drugs),
    db
      .select({ pendingSignals: count() })
      .from(regulatorySignals)
      .where(ne(regulatorySignals.currentStatus, "Completed")),
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(5),
  ]);

  const newLeadsCount = recentLeads.filter((l) => l.status === "New").length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Dashboard Overview
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Platform activity, user management, and regulatory compliance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Users
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2">
                {totalUsers}
              </h3>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Link
              href="/admin/users"
              className="text-orange-600 font-bold hover:underline flex items-center"
            >
              Manage Users &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Drugs
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2">
                {activeDrugs}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
              <Activity size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Link
              href="/admin/drugs"
              className="text-indigo-600 font-bold hover:underline"
            >
              Drug Portfolio &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Pending Signals
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2">
                {pendingSignals}
              </h3>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl group-hover:scale-110 transition-transform">
              <AlertTriangle size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Link
              href="/admin/intelligence/ema-signals/EMA-PRAC-2026-001"
              className="text-orange-600 font-bold hover:underline"
            >
              Review Signals &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                New Leads
              </p>
              <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2">
                {newLeadsCount}
              </h3>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl group-hover:scale-110 transition-transform">
              <UserCheck size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-bold flex items-center">
              <ArrowUpRight size={16} className="mr-1" /> Requires attention
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity / Leads */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Recent Pipeline Activity
          </h3>
          <Link
            href="/admin/leads"
            className="text-sm font-bold text-orange-600 dark:text-orange-400 hover:underline"
          >
            View Full Pipeline
          </Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {recentLeads.length > 0 ? (
            recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {lead.fullName}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {lead.company || "Individual"} &bull; {lead.email}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      lead.status === "New"
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {lead.status}
                  </span>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                    {new Date(lead.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              No recent leads.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
