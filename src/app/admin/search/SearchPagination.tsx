"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SearchPagination({
  currentPage,
  totalResults,
  pageSize,
}: {
  currentPage: number;
  totalResults: number;
  pageSize: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(pathname + "?" + createQueryString("page", page.toString()));
  };

  if (totalResults === 0) return null;

  return (
    <div className="pt-6 flex items-center justify-between border-t border-border">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary disabled:opacity-50 flex items-center gap-1"
      >
        <ChevronLeft size={16} /> Previous
      </button>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          Page {currentPage} of {totalPages}
        </span>
      </div>
      
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary disabled:opacity-50 flex items-center gap-1"
      >
        Next <ChevronRight size={16} />
      </button>
    </div>
  );
}
