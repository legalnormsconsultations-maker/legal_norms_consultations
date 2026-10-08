import type React from "react";
import { cn } from "@/lib/utils";

/**
 * Requirement 62: Mobile Experience (No Desktop-Only Data Tables)
 * This component elegantly renders a standard <table> on desktop (md+),
 * but automatically degrades into a stack of visually appealing cards on mobile.
 */

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  cell?: (item: T) => React.ReactNode;
}

interface ResponsiveDataListProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ResponsiveDataList<T>({
  data,
  columns,
  keyExtractor,
  className,
  emptyTitle = "No data available",
  emptyDescription,
}: ResponsiveDataListProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-secondary rounded-xl">
        <div className="font-semibold text-muted-foreground">{emptyTitle}</div>
        {emptyDescription && (
          <div className="text-sm mt-1">{emptyDescription}</div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* DESKTOP VIEW: Standard Table */}
      <div className="hidden md:block w-full overflow-hidden border border-border rounded-xl bg-card shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary border-b border-border text-muted-foreground font-medium">
            <tr>
              {columns.map((col, i) => (
                <th key={String(col.accessor) || i} className="px-6 py-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-secondary/50 transition-colors"
              >
                {columns.map((col, i) => {
                  const content = col.render
                    ? col.render(item)
                    : col.cell
                      ? col.cell(item)
                      : col.accessor
                        ? String(item[col.accessor])
                        : null;
                  return (
                    <td
                      key={`${keyExtractor(item)}-${String(col.accessor) || i}`}
                      className="px-6 py-4 text-muted-foreground"
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW: Stacked Cards */}
      <div className="flex flex-col gap-4 md:hidden">
        {data.map((item) => (
          <div
            key={keyExtractor(item)}
            className="border border-border rounded-xl bg-card p-4 shadow-sm flex flex-col gap-3"
          >
            {columns.map((col, i) => {
              const content = col.render
                ? col.render(item)
                : col.cell
                  ? col.cell(item)
                  : col.accessor
                    ? String(item[col.accessor])
                    : null;
              return (
                <div
                  key={`${keyExtractor(item)}-${String(col.accessor) || i}`}
                  className="flex flex-col"
                >
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    {col.header}
                  </span>
                  <span className="text-sm text-foreground">{content}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
