import Link from "next/link";

export function CatalogSearchForm({
  action,
  query,
  placeholder,
}: {
  action: string;
  query: string;
  placeholder: string;
}) {
  return (
    <form action={action} method="get" className="flex w-full max-w-xl gap-2">
      <label className="sr-only" htmlFor="catalog-query">
        Search catalog
      </label>
      <input
        id="catalog-query"
        name="q"
        type="search"
        defaultValue={query}
        placeholder={placeholder}
        className="h-10 min-w-0 flex-1 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
      />
      <button
        type="submit"
        className="h-10 rounded-md bg-teal-900 px-4 text-sm font-semibold text-white hover:bg-teal-800"
      >
        Search
      </button>
      {query && (
        <Link
          href={action}
          className="inline-flex h-10 items-center px-2 text-sm text-muted-foreground hover:text-foreground"
        >
          Clear
        </Link>
      )}
    </form>
  );
}

export function CatalogPagination({
  action,
  query,
  page,
  pageSize,
  total,
}: {
  action: string;
  query?: string;
  page: number;
  pageSize: number;
  total: number;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  const pageHref = (target: number) => {
    const nextParams = new URLSearchParams(params);
    nextParams.set("page", String(target));
    return `${action}?${nextParams.toString()}`;
  };

  return (
    <nav
      aria-label="Catalog pages"
      className="flex items-center justify-between border-t border-border pt-4 text-sm"
    >
      <span className="text-muted-foreground">
        {total === 0
          ? "No results"
          : `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, total)} of ${total}`}
      </span>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={pageHref(page - 1)}
            className="rounded-md border border-border px-3 py-1.5 font-medium text-muted-foreground hover:bg-secondary"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-md border border-border px-3 py-1.5 text-neutral-400">
            Previous
          </span>
        )}
        <span className="tabular-nums text-muted-foreground">
          {page} / {pageCount}
        </span>
        {page < pageCount ? (
          <Link
            href={pageHref(page + 1)}
            className="rounded-md border border-border px-3 py-1.5 font-medium text-muted-foreground hover:bg-secondary"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-md border border-border px-3 py-1.5 text-neutral-400">
            Next
          </span>
        )}
      </div>
    </nav>
  );
}
