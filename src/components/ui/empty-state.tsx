import { FolderSearch } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title = "No results found",
  description = "We couldn't find anything matching your criteria. Try adjusting your filters.",
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center rounded-xl border border-border border-dashed bg-secondary/50">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-neutral-400">
        {icon || <FolderSearch size={24} />}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
