import type { InferSelectModel } from "drizzle-orm";
import { Activity, BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import {
  CatalogPagination,
  CatalogSearchForm,
} from "@/components/catalog/catalog-controls";
import { ResponsiveDataList } from "@/components/ui/responsive-data-list";
import type { researchArticles } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { CatalogService } from "@/services/catalog.service";

type ResearchArticle = InferSelectModel<typeof researchArticles>;

export const metadata = {
  title: "Resources & Research | Legalnorms",
  description: "Scientific and regulatory research resources.",
};

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const researchResult = await CatalogService.listResearch(params);

  const researchColumns = [
    {
      header: "Article Title",
      accessor: "title" as const,
      render: (article: ResearchArticle) => (
        <Link
          href={`/research/${article.id}`}
          className="font-semibold text-teal-900 hover:underline"
        >
          {article.title}
        </Link>
      ),
    },
    { header: "Publisher", accessor: "publisher" as const },
    {
      header: "Publication Date",
      accessor: "publicationDate" as const,
      render: (article: ResearchArticle) =>
        article.publicationDate
          ? new Date(article.publicationDate).toLocaleDateString()
          : "N/A",
    },
    {
      header: "DOI",
      accessor: "doi" as const,
      render: (article: ResearchArticle) =>
        article.doi ? (
          <a
            href={`https://doi.org/${article.doi}`}
            target="_blank"
            rel="noreferrer"
            className="text-teal-700 hover:underline"
          >
            {article.doi}
          </a>
        ) : (
          "N/A"
        ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      {/* Navigation Header */}
      <header className="w-full bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-1.5 bg-teal-900 rounded shadow-sm">
              <Activity className="w-5 h-5 text-teal-50" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Legalnorms
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-teal-900"
            >
              Home
            </Link>
            {user ? (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName ?? "User"}
                    className="w-9 h-9 rounded-full object-cover border border-border shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#FF9933] border border-[#E68A2E] flex items-center justify-center text-white font-semibold text-sm">
                    {user.firstName?.[0]?.toUpperCase() ??
                      user.email[0].toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-teal-900 hover:underline"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto pt-10">
          <BookOpen className="w-16 h-16 text-teal-900/80 mx-auto mb-6" />
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Scientific Resources
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore peer-reviewed scientific studies, regulatory guidelines, and
            research papers cross-referenced with global health data.
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-700" /> Research & Articles
            Database
          </h2>

          <CatalogSearchForm
            action="/resources"
            query={params.q ?? ""}
            placeholder="Search for articles, publishers, or keywords..."
          />

          <div className="mt-8">
            <ResponsiveDataList
              data={researchResult.items}
              columns={researchColumns}
              keyExtractor={(article) => article.id}
            />
          </div>

          <div className="mt-8 border-t border-neutral-100 pt-6">
            <CatalogPagination
              action="/resources"
              query={params.q}
              page={researchResult.page}
              pageSize={researchResult.pageSize}
              total={researchResult.total}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
