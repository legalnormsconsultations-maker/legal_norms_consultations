import { desc } from "drizzle-orm";
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { fdaGuidances } from "@/db/schema";

export const metadata = {
  title: "FDA Guidances | Medical Portfolio",
  description: "Browse FDA guidance documents and AI-driven insights.",
};

const StatusBadge = ({ status }: { status: string }) => {
  const isDraft = status?.toLowerCase() === "draft";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDraft ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"}`}
    >
      {isDraft ? (
        <AlertTriangle className="w-3 h-3 mr-1" />
      ) : (
        <CheckCircle2 className="w-3 h-3 mr-1" />
      )}
      {status}
    </span>
  );
};

export default async function FDAGuidanceListPage() {
  const guidances = await db
    .select()
    .from(fdaGuidances)
    .orderBy(desc(fdaGuidances.issueDate));

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 lg:p-10 space-y-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          FDA Guidances
        </h1>

        <div className="grid grid-cols-1 gap-4">
          {guidances.map((guidance) => (
            <Link
              key={guidance.id}
              href={`/intelligence/guidance/${encodeURIComponent(guidance.docketNumber || guidance.id)}`}
              className="block"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-5 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors shadow-sm cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 max-w-4xl">
                    {guidance.title}
                  </h2>
                  <StatusBadge status={guidance.status || "Final"} />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center">
                    <FileText className="w-4 h-4 mr-1.5" />
                    {guidance.docketNumber}
                  </span>
                  <span className="flex items-center">
                    <Building2 className="w-4 h-4 mr-1.5" />
                    {guidance.center}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {guidance.issueDate
                      ? new Date(guidance.issueDate).toLocaleDateString()
                      : "Unknown Date"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {guidances.length === 0 && (
            <div className="text-center py-10 text-neutral-500">
              No FDA Guidances found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
