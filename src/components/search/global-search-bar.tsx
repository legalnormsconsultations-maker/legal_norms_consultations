"use client";

import { History, Loader2, Search, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";

// This component is designed as a standalone search layer that can hook
// into an external search provider (e.g., Elasticsearch, Algolia) via an abstracted API.

interface GlobalSearchBarProps {
  className?: string;
  placeholder?: string;
}

export function GlobalSearchBar({
  className,
  placeholder = "Search drugs, ingredients...",
}: GlobalSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<
    {
      id: string;
      type: string;
      title: string;
      subtitle?: string;
      url: string;
    }[]
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 300);

  // Handle click outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Call Search API
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      setIsSearching(true);
      fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || []);
          setIsSearching(false);
        })
        .catch((err) => {
          console.error("Search error", err);
          setIsSearching(false);
        });
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [debouncedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      setIsFocused(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full max-w-2xl", className)}
    >
      <div
        className={cn(
          "relative flex items-center w-full bg-background border transition-all duration-200 rounded-lg",
          isFocused
            ? "border-primary ring-4 ring-primary/10 shadow-sm"
            : "border-input hover:border-border/80 shadow-sm",
        )}
      >
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full min-w-0 h-12 pl-12 pr-12 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-medium text-sm"
          autoComplete="off"
          spellCheck="false"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 p-1 rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Autocomplete / Predictive Dropdown */}
      {isFocused && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {query.length > 2 && isSearching ? (
            <div className="p-8 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mb-2 text-primary" />
              <span className="text-sm">Searching regulatory indices...</span>
            </div>
          ) : query.length > 2 && !isSearching ? (
            <div className="p-2 max-h-80 overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No results found for "{query}"
                </div>
              ) : (
                results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    onClick={() => setIsFocused(false)}
                    className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/80 transition-colors flex flex-col group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                        {result.type}
                      </span>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {result.title}
                      </span>
                    </div>
                    {result.subtitle && (
                      <span className="text-xs text-muted-foreground truncate">
                        {result.subtitle}
                      </span>
                    )}
                  </Link>
                ))
              )}
            </div>
          ) : (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <History className="w-3 h-3" /> Recent Searches
              </div>
              <SearchResultItem title="Ibuprofen" subtitle="Search Term" />
              <SearchResultItem title="Pfizer Inc." subtitle="Manufacturer" />

              <div className="px-3 py-2 mt-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-t border-border/50">
                <TrendingUp className="w-3 h-3" /> Popular Right Now
              </div>
              <SearchResultItem
                title="Semaglutide"
                subtitle="Active Ingredient"
              />
              <SearchResultItem
                title="EMA Clinical Trial Regulation"
                subtitle="Regulatory Topic"
              />
            </div>
          )}

          <div className="p-3 bg-muted/50 border-t border-border flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              Press Enter for advanced search
            </span>
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={() => setIsFocused(false)}
              className="text-xs font-medium text-primary hover:underline"
            >
              Advanced Search
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchResultItem({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      className="w-full text-left px-3 py-2.5 rounded-md hover:bg-muted/80 transition-colors flex flex-col group"
    >
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
        {title}
      </span>
      <span className="text-xs text-muted-foreground">{subtitle}</span>
    </button>
  );
}
