import {
  Bookmark,
  FileText,
  Filter,
  Pill,
  Save,
  Search as SearchIcon,
} from "lucide-react";
import Link from "next/link";
import { SearchService } from "@/services/search.service";
import { SearchFilters } from "./SearchFilters";
import { SearchPagination } from "./SearchPagination";

interface SearchParams {
  q?: string;
  type?: string;
  jurisdiction?: string;
  authority?: string;
  status?: string;
  page?: string;
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const {
    q = "",
    type = "all",
    jurisdiction = "",
    page = "1",
  } = await searchParams;

  const currentPage = parseInt(page, 10) || 1;
  const pageSize = 10;
  const offset = (currentPage - 1) * pageSize;

  const { results, total } = q.length >= 2 
    ? await SearchService.globalSearch(q, { type, limit: pageSize, offset }) 
    : { results: [], total: 0 };

  const showingStart = Math.min(offset + 1, total);
  const showingEnd = Math.min(offset + results.length, total);

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Sidebar: Filters */}
      <SearchFilters />

      {/* Main Content: Search Results */}
      <main className="flex-1 space-y-6">
        {/* Search Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {q ? `Results for "${q}"` : "Search Directory"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {q && total > 0 ? `Showing ${showingStart}-${showingEnd} of ${total} results.` : ""}
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors shadow-sm text-muted-foreground"
          >
            <Save size={16} /> Save Search
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          {q && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl border border-border">
              <SearchIcon size={48} className="text-neutral-300 mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">
                No results found
              </h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find anything matching "{q}". Try adjusting your
                search terms.
              </p>
            </div>
          ) : (
            results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.url}
                className="block group"
              >
                <ResultCard
                  title={result.title}
                  type={result.type}
                  icon={
                    result.type === "DRUG" ? (
                      <Pill size={18} className="text-orange-500" />
                    ) : result.type === "DOCUMENT" ? (
                      <FileText size={18} className="text-emerald-500" />
                    ) : (
                      <Bookmark size={18} className="text-purple-500" />
                    )
                  }
                  status="Active"
                  metadata={result.subtitle || "Result"}
                  relevance="High"
                />
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        <SearchPagination 
          currentPage={currentPage}
          totalResults={total}
          pageSize={pageSize}
        />
      </main>
    </div>
  );
}

type ResultCardProps = {
  title: string;
  type: string;
  status: string;
  jurisdiction?: string;
  manufacturer?: string;
  metadata: string;
  relevance: string;
  icon: React.ReactNode;
};

function ResultCard({
  title,
  type,
  status,
  jurisdiction,
  manufacturer,
  metadata,
  relevance,
  icon,
}: ResultCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {icon}
          <span>{type}</span>
          <span className="text-neutral-300">•</span>
          <span className="text-primary-600">{relevance} Match</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
          {manufacturer && (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />{" "}
              {manufacturer}
            </span>
          )}
          {jurisdiction && (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />{" "}
              {jurisdiction}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />{" "}
            {metadata}
          </span>
        </div>
      </div>

      <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between">
        <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
          {status}
        </span>
      </div>
    </div>
  );
}
