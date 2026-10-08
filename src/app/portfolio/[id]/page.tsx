import { and, eq } from "drizzle-orm";
import {
  ActivitySquare,
  AlignLeft,
  ArrowLeft,
  Briefcase,
  Calendar,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { portfolioItems } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";

export default async function PortfolioDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Enforce Row-Level Security Equivalent in App Layer
  const [item] = await db
    .select()
    .from(portfolioItems)
    .where(
      and(
        eq(portfolioItems.id, params.id),
        eq(portfolioItems.ownerId, user.id),
      ),
    )
    .limit(1);

  if (!item) return notFound();

  return (
    <div className="min-h-screen bg-black">
      {/* Top Navbar */}
      <nav className="w-full border-b border-neutral-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/admin/dashboard/portfolio"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Portfolio
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* Header Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase">
              <Briefcase className="w-3.5 h-3.5" />
              Portfolio Item
            </span>
            <span className="text-muted-foreground text-sm font-medium flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Added: {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            {item.productName}
          </h1>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-2 text-neutral-300">
              <Tag className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-white">Category:</span>
              {item.category || "Uncategorized"}
            </div>
            <div className="flex items-center gap-2 text-neutral-300">
              <ActivitySquare className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-white">Phase:</span>
              {item.phase || "Unknown Phase"}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <AlignLeft className="w-5 h-5 text-muted-foreground" /> Project
              Description
            </h2>
            {item.description ? (
              <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {item.description}
              </p>
            ) : (
              <div className="text-muted-foreground italic">
                No detailed description provided for this portfolio item.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
