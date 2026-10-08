"use client";

import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce"; // We'll need to create this if it doesn't exist

type SearchResult = {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  url: string;
};

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 300);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Failed to search", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-neutral-400" />
          <input
            type="search"
            placeholder="Search drugs, manufacturers, documents..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-10 pr-4 py-2 text-sm text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-900/50 transition-all placeholder:text-muted-foreground"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 h-4 w-4 text-neutral-400 animate-spin" />
          )}
        </div>
      </form>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 && !isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    onClick={() => setIsOpen(false)}
                    className="flex items-start gap-3 p-3 hover:bg-neutral-800 rounded-lg transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700 transition-colors">
                          {result.type}
                        </span>
                        <p className="text-sm font-medium text-neutral-100 truncate">
                          {result.title}
                        </p>
                      </div>
                      {result.subtitle && (
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t border-neutral-800 bg-neutral-950/50">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }}
              className="w-full text-center text-xs text-red-400 hover:text-red-300 transition-colors py-1 font-medium"
            >
              View all results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
