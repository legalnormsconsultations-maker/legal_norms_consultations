import {
  ArrowLeft,
  BookOpen,
  Building2,
  Calendar,
  ExternalLink,
  Link as LinkIcon,
  Quote,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogService } from "@/services/catalog.service";

export default async function ResearchArticleDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const article = await CatalogService.getResearchArticleDetail(params.id);

  if (!article) return notFound();

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

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        {/* Header Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold tracking-widest uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              Research Publication
            </span>
            {article.publicationDate && (
              <span className="text-muted-foreground text-sm font-medium flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(article.publicationDate).toLocaleDateString()}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
            {article.publisher && (
              <div className="flex items-center gap-2 text-neutral-300">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-white">Publisher:</span>
                {article.publisher}
              </div>
            )}
            {article.doi && (
              <div className="flex items-center gap-2 text-neutral-300">
                <LinkIcon className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold text-white">DOI:</span>
                <a
                  href={`https://doi.org/${article.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-400 hover:underline"
                >
                  {article.doi}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Abstract & Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {article.abstract ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Quote className="w-5 h-5 text-muted-foreground" /> Abstract
                </h2>
                <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {article.abstract}
                </p>
              </div>
            ) : (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-muted-foreground">
                No abstract provided for this publication.
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col">
              <h2 className="text-lg font-semibold text-white mb-4">
                Access Full Text
              </h2>
              <p className="text-neutral-400 text-sm mb-6 flex-1">
                Access the full research article on the publisher's external
                portal.
              </p>
              {article.url ? (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-card hover:bg-accent hover:text-accent-foreground text-foreground rounded-lg font-bold transition-colors shadow-lg"
                >
                  Open External Link <ExternalLink size={16} />
                </a>
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-neutral-800 text-muted-foreground rounded-lg font-semibold cursor-not-allowed"
                >
                  No URL Available
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
