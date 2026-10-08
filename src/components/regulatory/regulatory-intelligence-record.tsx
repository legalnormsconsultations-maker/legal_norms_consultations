import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Info,
  Map,
  ShieldCheck,
  Tag,
  Users,
  Zap,
} from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

export interface RegulatoryIntelligenceRecordProps {
  agency: string;
  eventType: string;
  sourceAuthority: string;
  officialDocumentNumber: string;
  publicationDate: string;
  lastUpdatedDate: string;
  effectiveDate?: string;
  status: string;
  systemPriority: "Critical" | "High" | "Medium" | "Low";
  officialRegulatoryClassification: string;
  therapeuticArea: string;
  product: string;
  region: string;
  affectedStakeholder: string;
  sourceConfidence: string;
  dataFreshness: string;
  className?: string;
}

const getPriorityConfig = (
  priority: RegulatoryIntelligenceRecordProps["systemPriority"],
) => {
  switch (priority) {
    case "Critical":
      return {
        color:
          "bg-red-500/15 text-red-700 border-red-200 dark:border-red-900/50 dark:text-red-400",
        icon: AlertOctagon,
      };
    case "High":
      return {
        color:
          "bg-orange-500/15 text-orange-700 border-orange-200 dark:border-orange-900/50 dark:text-orange-400",
        icon: AlertTriangle,
      };
    case "Medium":
      return {
        color:
          "bg-yellow-500/15 text-yellow-700 border-yellow-200 dark:border-yellow-900/50 dark:text-yellow-400",
        icon: Info,
      };
    case "Low":
    default:
      return {
        color:
          "bg-orange-500/15 text-orange-700 border-orange-200 dark:border-orange-900/50 dark:text-orange-400",
        icon: CheckCircle2,
      };
  }
};

const getStatusConfig = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes("draft"))
    return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  if (normalized.includes("final") || normalized.includes("active"))
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50";
  if (normalized.includes("withdrawn") || normalized.includes("superseded"))
    return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-900/50";
  return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
};

export function RegulatoryIntelligenceRecord({
  agency,
  eventType,
  sourceAuthority,
  officialDocumentNumber,
  publicationDate,
  lastUpdatedDate,
  effectiveDate,
  status,
  systemPriority,
  officialRegulatoryClassification,
  therapeuticArea,
  product,
  region,
  affectedStakeholder,
  sourceConfidence,
  dataFreshness,
  className,
}: RegulatoryIntelligenceRecordProps) {
  const priorityConfig = getPriorityConfig(systemPriority);
  const PriorityIcon = priorityConfig.icon;
  const statusColor = getStatusConfig(status);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden",
        className,
      )}
    >
      {/* Header Section */}
      <div className="border-b border-border bg-muted/30 px-6 py-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Regulatory Event Header
              </span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              {eventType}
            </h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {agency}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {officialDocumentNumber}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 md:items-end">
            <div className="flex items-center gap-2">
              {/* Internal Triage Badge */}
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                  priorityConfig.color,
                )}
                title="Internal System Triage Score"
              >
                <PriorityIcon className="h-3.5 w-3.5" />
                System Priority: {systemPriority}
              </div>

              {/* Status Badge */}
              <div
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border",
                  statusColor,
                )}
              >
                {status}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1" title="Data Freshness">
                <Clock className="h-3 w-3" />
                {dataFreshness}
              </span>
              <span
                className="flex items-center gap-1"
                title="Source Confidence"
              >
                <ShieldCheck className="h-3 w-3" />
                {sourceConfidence}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 bg-card">
        {/* Column 1: Regulatory Classification */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground border-b pb-2">
            Classification & Authority
          </h3>
          <ul className="space-y-3">
            <li className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Official Regulatory
                Classification
              </span>
              <span className="text-sm font-medium">
                {officialRegulatoryClassification}
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> Source Authority
              </span>
              <span className="text-sm font-medium">{sourceAuthority}</span>
            </li>
          </ul>
        </div>

        {/* Column 2: Scope & Impact */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground border-b pb-2">
            Scope & Impact
          </h3>
          <ul className="space-y-3">
            <li className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" /> Therapeutic Area
              </span>
              <span className="text-sm font-medium">{therapeuticArea}</span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Product / Molecule
              </span>
              <span className="text-sm font-medium">{product}</span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Map className="h-3.5 w-3.5" /> Region / Market
              </span>
              <span className="text-sm font-medium">{region}</span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Affected Stakeholder
              </span>
              <span className="text-sm font-medium">{affectedStakeholder}</span>
            </li>
          </ul>
        </div>

        {/* Column 3: Timeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground border-b pb-2">
            Timeline
          </h3>
          <ul className="space-y-3">
            <li className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" /> Publication Date
              </span>
              <span className="text-sm font-medium">{publicationDate}</span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Last Updated Date
              </span>
              <span className="text-sm font-medium">{lastUpdatedDate}</span>
            </li>
            {effectiveDate && (
              <li className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />{" "}
                  Effective Date
                </span>
                <span className="text-sm font-medium">{effectiveDate}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
