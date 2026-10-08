"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred while fetching this data.",
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border-2 border-dashed border-red-200 bg-red-50/50">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertTriangle className="text-red-600" size={24} />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          <RefreshCcw size={16} className={isRetrying ? "animate-spin" : ""} />
          {isRetrying ? "Retrying..." : "Try Again"}
        </button>
      )}
    </div>
  );
}
