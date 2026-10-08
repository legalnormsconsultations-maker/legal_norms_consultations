"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRightLeft,
  BellRing,
  BriefcaseMedical,
  Building2,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Info,
  ListTodo,
  Sparkles,
  UserPlus,
  X,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

// --- Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const isDraft = status?.toLowerCase() === "draft";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDraft ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"}`}
    >
      {isDraft ? (
        <AlertTriangle className="w-3 h-3 mr-1" />
      ) : (
        <CheckCircle2 className="w-3 h-3 mr-1" />
      )}
      {status}
    </span>
  );
};

const ImpactBadge = ({ impact }: { impact: string }) => {
  const colors: Record<string, string> = {
    High: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
    Medium:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    Low: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  };
  const colorClass = colors[impact] || colors.Low;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colorClass}`}
    >
      {impact}
    </span>
  );
};

export default function GuidanceClient({ guidance }: { guidance: any }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentText, setAssessmentText] = useState("");
  const [isAssessing, setIsAssessing] = useState(false);

  // Task state
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskFeedback, setTaskFeedback] = useState<string | null>(null);

  // Advanced Task Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");

  if (!guidance) return <div>Guidance not found</div>;

  const tags = [
    "Drug",
    "Biologic",
    "Generic",
    "Oncology",
    "Rare Disease",
    "Clinical Trial",
    "Medical Device",
    "Digital Health",
  ];

  const handleCreateTask = async (actionType: string) => {
    if (actionType === "Create Regulatory Task") {
      setShowTaskModal(true);
      return;
    }
    await submitTask(actionType);
  };

  const submitTask = async (
    actionType: string,
    assigneeId?: string,
    dueDate?: string,
  ) => {
    setIsCreatingTask(true);
    setTaskFeedback(null);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionType,
          guidanceId: guidance.id,
          docketNumber: guidance.docketNumber,
          assigneeId,
          dueDate,
        }),
      });
      if (res.ok) {
        setTaskFeedback(`Successfully initiated: ${actionType}`);
        setShowTaskModal(false);
        setTimeout(() => setTaskFeedback(null), 3000);
      } else {
        setTaskFeedback("Failed to initiate action.");
      }
    } catch (err) {
      setTaskFeedback("Error connecting to server.");
    } finally {
      setIsCreatingTask(false);
    }
  };

  const toggleTag = async (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);

    if (newTags.length > 0) {
      setShowAssessment(true);
      setIsAssessing(true);

      try {
        const res = await fetch(
          `/api/guidance/${encodeURIComponent(guidance.docketNumber)}/assess`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tags: newTags }),
          },
        );

        if (res.ok) {
          const data = await res.json();
          setAssessmentText(data.assessment);
        } else {
          setAssessmentText("Error generating assessment.");
        }
      } catch (err) {
        setAssessmentText("Failed to reach assessment engine.");
      } finally {
        setIsAssessing(false);
      }
    } else {
      setShowAssessment(false);
      setAssessmentText("");
    }
  };

  const calculateDaysRemaining = (closingDate: string | Date) => {
    if (!closingDate) return 0;
    const diffTime = Math.abs(new Date(closingDate).getTime() - Date.now());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = calculateDaysRemaining(guidance.commentClosingDate);

  const aiExecSum = guidance.aiExecutiveSummary || {};
  const aiDiff = guidance.aiDiffAnalysis || [];
  const aiImpact = guidance.aiRegulatoryImpact || [];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 p-6 lg:p-10 space-y-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-sm text-neutral-500 dark:text-neutral-400">
            <span>FDA Intelligence</span>
            <ChevronRight className="w-4 h-4" />
            <span>Guidances</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-neutral-900 dark:text-neutral-100">
              {guidance.docketNumber}
            </span>
          </div>
          <div className="flex space-x-2">
            <a
              href={guidance.officialPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Official PDF</span>
            </a>
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-600/20">
              <Sparkles className="w-4 h-4" />
              <span>Generate Briefing</span>
            </button>
          </div>
        </div>

        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
          {guidance.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <StatusBadge status={guidance.status} />
          <span className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">
            <Building2 className="w-4 h-4 mr-2" />
            {guidance.center}
          </span>
          <span className="flex items-center text-sm text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800">
            <Calendar className="w-4 h-4 mr-2" />
            Issued: {new Date(guidance.issueDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Applicability Engine */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <BriefcaseMedical className="w-5 h-5 mr-2 text-indigo-500" />
                Guidance Applicability Engine
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                Select filters describing your regulatory program to assess
                relevance.
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {showAssessment && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            AI System Assessment
                          </span>
                        </div>
                        <p className="text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                          {isAssessing ? (
                            <span className="flex items-center text-indigo-600 animate-pulse">
                              Analyzing portfolio overlap...
                            </span>
                          ) : (
                            assessmentText
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* AI Executive Summary */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-indigo-200" />
                AI Executive Summary
              </h2>
              <span className="text-xs font-medium bg-white/20 text-white px-2 py-1 rounded">
                Source-Grounded
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: "What changed?", data: aiExecSum.whatChanged },
                { title: "Why does it matter?", data: aiExecSum.whyItMatters },
                { title: "Who is affected?", data: aiExecSum.whoIsAffected },
                {
                  title: "What action is required?",
                  data: aiExecSum.actionRequired,
                },
                { title: "What is the deadline?", data: aiExecSum.deadline },
                {
                  title: "What happens if ignored?",
                  data: aiExecSum.ifIgnored,
                },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.title}
                  </h3>
                  {item.data ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.data.text}
                      <span className="inline-block ml-1 group relative cursor-help">
                        <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1 py-0.5 rounded">
                          {item.data.citation}
                        </span>
                        {/* Tooltip */}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-neutral-900 text-white text-xs rounded p-2 z-10 shadow-lg">
                          Exact extract matched from original PDF document.
                        </span>
                      </span>
                    </p>
                  ) : (
                    <span className="text-sm text-neutral-400">
                      Processing...
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* "What Changed?" Diff Engine */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold flex items-center">
                <ArrowRightLeft className="w-5 h-5 mr-2 text-indigo-500" />
                "What Changed?" Diff Engine
              </h2>
              <span className="text-xs text-neutral-500 flex items-center">
                Comparing against{" "}
                <span className="font-mono ml-1 bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded">
                  {guidance.supersedes?.[0] || "Previous"}
                </span>
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-950/50 uppercase border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-6 py-3 font-medium">Area</th>
                    <th className="px-6 py-3 font-medium text-rose-600 dark:text-rose-400">
                      Previous
                    </th>
                    <th className="px-6 py-3 font-medium text-emerald-600 dark:text-emerald-400">
                      New
                    </th>
                    <th className="px-6 py-3 font-medium">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {aiDiff.map((row: any, idx: number) => (
                    <tr
                      key={idx}
                      className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-neutral-900 dark:text-neutral-100">
                        {row.area}
                      </td>
                      <td className="px-6 py-4 text-rose-700 dark:text-rose-300 bg-rose-50/30 dark:bg-rose-900/10 line-through decoration-rose-300">
                        {row.previous}
                      </td>
                      <td className="px-6 py-4 text-emerald-700 dark:text-emerald-300 bg-emerald-50/30 dark:bg-emerald-900/10 font-medium">
                        {row.new}
                      </td>
                      <td className="px-6 py-4">
                        <ImpactBadge impact={row.impact} />
                      </td>
                    </tr>
                  ))}
                  {aiDiff.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-4 text-neutral-400"
                      >
                        No diffs recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Regulatory Impact Matrix */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-gradient-to-r from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950">
              <h2 className="text-lg font-semibold flex items-center">
                <ListTodo className="w-5 h-5 mr-2 text-indigo-500" />
                Regulatory Impact Matrix
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiImpact.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 hover:border-indigo-300 dark:hover:border-indigo-700/50 transition-colors bg-white dark:bg-neutral-900 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.function}
                    </h3>
                    <ImpactBadge impact={item.impact} />
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 h-10 line-clamp-2">
                    {item.action}
                  </p>
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-2 font-bold">
                        {item.owner.charAt(0)}
                      </div>
                      {item.owner}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(item.deadline).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Comment Deadline Intelligence */}
          {guidance.status === "Draft" && (
            <div className="bg-gradient-to-b from-rose-50 to-white dark:from-rose-950/20 dark:to-neutral-900 rounded-2xl border border-rose-200 dark:border-rose-900/50 p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

              <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-semibold mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Action Required</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                {daysRemaining} Days Remaining
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                Comment period closes on{" "}
                {new Date(guidance.commentClosingDate).toLocaleDateString()}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => handleCreateTask("Create Regulatory Task")}
                  disabled={isCreatingTask}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                  <ListTodo className="w-4 h-4" />
                  <span>
                    {isCreatingTask ? "Creating..." : "Create Regulatory Task"}
                  </span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleCreateTask("Add to Calendar")}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Calendar</span>
                  </button>
                  <button
                    onClick={() => handleCreateTask("Assign Review")}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Assign</span>
                  </button>
                </div>
                <button
                  onClick={() => handleCreateTask("Automate Reminders")}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  <BellRing className="w-4 h-4" />
                  <span>Automate Reminders</span>
                </button>
                {taskFeedback && (
                  <div className="text-xs text-center text-emerald-600 dark:text-emerald-400 mt-2">
                    {taskFeedback}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Info className="w-5 h-5 mr-2 text-indigo-500" />
              Guidance Metadata
            </h3>

            <div className="space-y-4">
              <MetadataRow label="Document Type" value={guidance.type} />
              <MetadataRow label="Center" value={guidance.center} />
              <MetadataRow label="Office" value={guidance.office} />
              <MetadataRow label="Topic" value={guidance.topic} />
              <MetadataRow
                label="Docket Number"
                value={guidance.docketNumber}
              />

              <div className="border-t border-neutral-100 dark:border-neutral-800 my-4"></div>

              <MetadataRow
                label="Supersedes"
                value={
                  <div className="flex flex-wrap gap-1">
                    {(guidance.supersedes || []).map((id: string) => (
                      <span
                        key={id}
                        className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                }
              />

              <MetadataRow
                label="Related"
                value={
                  <div className="flex flex-wrap gap-1">
                    {(guidance.relatedGuidances || []).map((id: string) => (
                      <span
                        key={id}
                        className="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Create Regulatory Task
                </h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Assign To
                  </label>
                  <input
                    type="email"
                    placeholder="colleague@example.com"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-2 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Task will automatically include the guidance context, link to
                  this page, and notify the assignee.
                </p>
              </div>

              <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-3 bg-neutral-50/50 dark:bg-neutral-800/20">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    submitTask(
                      "Create Regulatory Task",
                      taskAssignee,
                      taskDueDate,
                    )
                  }
                  disabled={isCreatingTask}
                  className="px-4 py-2 text-sm font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center"
                >
                  {isCreatingTask ? "Creating..." : "Confirm & Assign"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MetadataRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">
      {label}
    </div>
    <div className="text-sm text-neutral-900 dark:text-neutral-100">
      {value}
    </div>
  </div>
);
