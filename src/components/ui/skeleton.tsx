import type * as React from "react";

/**
 * Core UI: Skeleton
 *
 * Provides a standardized pulsing animation block to act as a placeholder
 * during Loading states to prevent Cumulative Layout Shift (CLS).
 */
function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200/60 ${className}`}
      {...props}
    />
  );
}

export { Skeleton };
