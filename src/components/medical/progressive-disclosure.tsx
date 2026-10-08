import { ChevronDown, ChevronUp, Clock, FileText, Info } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Assumes tailwind-merge util exists

/**
 * Requirement 61: Progressive Disclosure Architecture
 * Forces medical/regulatory intelligence into a strict 5-tier UX hierarchy
 * preventing cognitive overload.
 */

interface ProgressiveDisclosureProps {
  summary: React.ReactNode;
  keyFacts: React.ReactNode;
  detailedInfo: React.ReactNode;
  historicalDetails?: React.ReactNode;
  sourceDocuments?: React.ReactNode;
  className?: string;
}

export function ProgressiveDisclosure({
  summary,
  keyFacts,
  detailedInfo,
  historicalDetails,
  sourceDocuments,
  className,
}: ProgressiveDisclosureProps) {
  const [expandedTier, setExpandedTier] = useState<number>(2); // Default opens up to Key Facts

  return (
    <div
      className={cn(
        "flex flex-col gap-4 w-full border border-border rounded-xl bg-card shadow-sm overflow-hidden",
        className,
      )}
    >
      {/* 1. SUMMARY TIER */}
      <div className="p-6 bg-secondary border-b border-border">
        <h3 className="text-xl font-semibold text-foreground tracking-tight">
          {summary}
        </h3>
      </div>

      {/* 2. KEY FACTS TIER */}
      {expandedTier >= 2 && (
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <Info className="w-4 h-4" /> Key Facts
          </div>
          <div className="text-foreground">{keyFacts}</div>
        </div>
      )}

      {/* 3. DETAILED INFO TIER */}
      {expandedTier >= 3 && (
        <div className="px-6 py-4 border-t border-gray-100 bg-card">
          <div className="text-muted-foreground leading-relaxed">
            {detailedInfo}
          </div>
        </div>
      )}

      {/* 4. HISTORICAL DETAILS TIER */}
      {expandedTier >= 4 && historicalDetails && (
        <div className="px-6 py-4 border-t border-gray-100 bg-secondary/50">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <Clock className="w-4 h-4" /> Historical Context
          </div>
          <div className="text-muted-foreground">{historicalDetails}</div>
        </div>
      )}

      {/* 5. SOURCE DOCUMENTS TIER */}
      {expandedTier >= 5 && sourceDocuments && (
        <div className="px-6 py-4 border-t border-border bg-muted">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Original Source Documents
          </div>
          <div>{sourceDocuments}</div>
        </div>
      )}

      {/* EXPANSION CONTROLS */}
      <div className="p-2 border-t border-border bg-secondary flex justify-center">
        {expandedTier < 5 ? (
          <button
            type="button"
            onClick={() => setExpandedTier((prev) => Math.min(prev + 1, 5))}
            className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 px-4 py-2 rounded-md hover:bg-orange-50 transition-colors"
          >
            Expand Context <ChevronDown className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setExpandedTier(2)}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-muted-foreground px-4 py-2 rounded-md hover:bg-muted transition-colors"
          >
            Collapse Information <ChevronUp className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
