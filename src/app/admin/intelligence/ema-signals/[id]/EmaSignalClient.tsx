"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  FileWarning,
  Info,
  Microscope,
  Scale,
  ShieldAlert,
  Users,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function EmaSignalClient({ initialData: signalData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Overview */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-xl">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              EMA PRAC Safety Signal
            </h1>
            <p className="text-sm text-zinc-500 font-medium mt-1">
              Ref: {signalData.referenceId}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <OverviewCard
            icon={<Microscope size={20} />}
            label="Drug / Substance"
            value={signalData.substanceName}
          />
          <OverviewCard
            icon={<AlertTriangle size={20} className="text-amber-500" />}
            label="Risk"
            value={signalData.riskDescription}
          />
          <OverviewCard
            icon={<Users size={20} />}
            label="Affected Population"
            value={signalData.affectedPopulation}
          />
          <OverviewCard
            icon={<FileWarning size={20} />}
            label="Regulatory Action"
            value={signalData.regulatoryAction}
          />
          <OverviewCard
            icon={<Activity size={20} className="text-emerald-500" />}
            label="Current Status"
            value={signalData.currentStatus}
          />
        </div>
      </div>

      {/* Lifecycle Timeline */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm overflow-x-auto">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
          <Clock size={18} className="text-zinc-500" />
          Safety Signal Lifecycle
        </h2>
        <div className="flex items-start min-w-[800px]">
          {(signalData.timeline || []).map((item: any, idx: number) => (
            <div key={item.stage} className="relative flex-1 group">
              {idx !== (signalData.timeline?.length || 0) - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-6 right-0 h-[2px]",
                    item.status === "completed"
                      ? "bg-emerald-500"
                      : item.status === "in-progress"
                        ? "bg-orange-500"
                        : "bg-zinc-200 dark:bg-zinc-800",
                  )}
                />
              )}
              <div className="relative z-10 flex flex-col items-start pr-4">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border-2 mb-3 shadow-sm transition-transform group-hover:scale-110",
                    item.status === "completed"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : item.status === "in-progress"
                        ? "bg-orange-500 border-orange-500 text-black dark:text-white animate-pulse"
                        : "bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-400",
                  )}
                >
                  {item.status === "completed" && <CheckCircle2 size={16} />}
                  {item.status === "in-progress" && (
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  )}
                </div>
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {item.stage}
                </h3>
                <p className="text-xs text-zinc-500 font-medium mt-1">
                  {item.date}
                </p>
                <div className="mt-2 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-lg border border-zinc-100 dark:border-zinc-800/50 text-[11px] text-zinc-600 dark:text-zinc-400 leading-tight w-full opacity-80 group-hover:opacity-100 transition-opacity">
                  {item.evidence}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Profile */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
              <Scale size={18} className="text-zinc-500" />
              Risk Profile
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(signalData.riskProfile || {}).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="bg-zinc-50 dark:bg-zinc-800/30 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-sm text-zinc-900 dark:text-zinc-200 font-medium leading-snug">
                      {value}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Product Information Change */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <FileText size={18} className="text-orange-500" />
                Product Information Change
              </h2>
              <span className="px-3 py-1 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-full uppercase tracking-widest">
                {signalData.productInfoChange?.type || "update"}
              </span>
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-4 bg-zinc-100 dark:bg-zinc-800 inline-block px-3 py-1 rounded-md">
                {signalData.productInfoChange?.section}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-red-500 uppercase tracking-wider">
                    <div className="w-2 h-2 rounded-full bg-red-500" /> Before
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/20 p-5 rounded-xl border border-red-100 dark:border-red-900/30 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed min-h-[150px]">
                    {signalData.productInfoChange?.before}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-500 uppercase tracking-wider">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />{" "}
                    After
                  </div>
                  <div
                    className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed min-h-[150px]"
                    dangerouslySetInnerHTML={{
                      __html: signalData.productInfoChange?.after || "",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Pharmacovigilance Evidence */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
              <Eye size={18} className="text-indigo-500" />
              Pharmacovigilance Evidence
            </h2>
            <div className="space-y-4">
              {Object.entries(signalData.evidence || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="pb-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 last:pb-0"
                >
                  <p className="text-xs font-medium text-zinc-500 mb-1 flex items-center gap-1.5">
                    <Info size={12} />
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .replace(/^./, (str) => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-zinc-800 dark:text-zinc-200">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Action Tracker */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
              <Activity size={18} className="text-orange-500" />
              Regulatory Action Tracker
            </h2>
            <div className="space-y-4">
              {(signalData.actionTracker || []).map((action: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {action.action}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {action.date}
                    </p>
                  </div>
                  <div
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-semibold",
                      action.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : action.status === "Submitted"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : action.status === "In Progress"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                    )}
                  >
                    {action.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-4 border border-zinc-100 dark:border-zinc-800/50">
      <div className="flex flex-col gap-2">
        <div className="text-zinc-400 dark:text-zinc-500">{icon}</div>
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-1 line-clamp-2">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
