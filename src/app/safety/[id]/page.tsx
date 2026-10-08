import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CalendarClock,
  Clock,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogService } from "@/services/catalog.service";

export default async function SafetyUpdateDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const update = await CatalogService.getSafetyUpdateDetail(params.id);

  if (!update) return notFound();

  return (
    <div className="min-h-screen bg-black">
      <nav className="w-full border-b border-neutral-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/admin/dashboard/alerts"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Alerts
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-600" />

          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold tracking-widest uppercase">
              <AlertTriangle className="w-3.5 h-3.5" />
              {update.severity}
            </span>
            <span className="text-muted-foreground text-sm font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(update.issuedDate).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            {update.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-2 text-neutral-300">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-white">Authority:</span>
              {update.authorityName
                ? `${update.authorityName} (${update.authorityAcronym})`
                : update.authorityId || "Unknown Authority"}
            </div>
            {update.drugName && (
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="font-semibold text-white">Product:</span>
                <Link
                  href={`/drugs/${update.drugId}`}
                  className="text-teal-400 hover:underline"
                >
                  {update.drugName}
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-neutral-400" /> Description
            </h2>
            <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
              {update.description}
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-neutral-400" /> System
              Tracking
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                  Issued Date
                </label>
                <div className="text-neutral-300 font-medium">
                  {new Date(update.issuedDate).toLocaleString()}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                  Record Created At
                </label>
                <div className="text-neutral-300 font-medium">
                  {new Date(update.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
