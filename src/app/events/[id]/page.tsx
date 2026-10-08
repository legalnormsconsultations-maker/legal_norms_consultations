import {
  Activity,
  ArrowLeft,
  Building2,
  CalendarClock,
  Clock,
  ExternalLink,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogService } from "@/services/catalog.service";

export default async function RegulatoryEventDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const event = await CatalogService.getRegulatoryEventDetail(params.id);

  if (!event) return notFound();

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navbar */}
      <nav className="w-full border-b border-neutral-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* Header Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />

          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-widest uppercase">
              <Activity className="w-3.5 h-3.5" />
              {event.eventType}
            </span>
            <span className="text-muted-foreground text-sm font-medium flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {new Date(event.eventTimestamp).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            {event.eventTitle}
          </h1>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-2 text-neutral-300">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-white">Authority:</span>
              {event.authorityName
                ? `${event.authorityName} (${event.authorityAcronym})`
                : event.authorityId || "Unknown Authority"}
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <Activity className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-white">Phase:</span>
              {event.milestonePhase || "N/A"}
            </div>
            {event.sourceName && (
              <div className="flex items-center gap-2 text-neutral-300">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-white">Source:</span>
                {event.sourceName}
              </div>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-neutral-400" /> Event
              Timestamps
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                  Occurred At
                </label>
                <div className="text-neutral-300 font-medium">
                  {new Date(event.eventTimestamp).toLocaleString()}
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                  System Record Logged
                </label>
                <div className="text-neutral-300 font-medium">
                  {new Date(event.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-neutral-400" /> Associated
              Evidence
            </h2>
            <p className="text-neutral-400 text-sm mb-6 flex-1">
              Verify the authenticity of this event by viewing the original
              regulatory publication or source material.
            </p>
            {event.sourceUrl ? (
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
              >
                Access Source Document <ExternalLink size={16} />
              </a>
            ) : (
              <button
                disabled
                className="w-full py-3 bg-neutral-800 text-muted-foreground rounded-lg font-semibold cursor-not-allowed"
              >
                No Source URL Provided
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
