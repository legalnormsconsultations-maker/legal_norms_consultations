"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Download,
  Edit,
  FileSearch,
  History,
  Loader2,
  Plus,
  Save,
  Share2,
  Sparkles,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { RegulatoryIntelligenceRecord } from "@/components/regulatory/regulatory-intelligence-record";
import {
  assignRecordReview,
  deleteIntelligenceRecord,
  generateAISummary,
  getIntelligenceRecord,
  getRealtimeUsers,
  saveImpactAssessment,
  toggleRecordSubscription,
  updateIntelligenceRecord,
  getImpactAssessment,
  getDrugs,
} from "./actions";

export default function RegulatoryRecordPage() {
  const params = useParams();
  const router = useRouter();
  const recordId = params.id as string;

  const [record, setRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "impact" | "timeline">(
    "summary",
  );
  const [isTracking, setIsTracking] = useState(false);
  const [showToast, setShowToast] = useState<{
    message: string;
    type: "success" | "info" | "error";
  } | null>(null);

  // Admin Edit Modal States
  const [isEditRecordModalOpen, setIsEditRecordModalOpen] = useState(false);
  const [isDeleteRecordModalOpen, setIsDeleteRecordModalOpen] = useState(false);

  // Assign Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignee, setAssignee] = useState("");

  // AI Summary State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  // Impact Assessment State
  const [impactLevel, setImpactLevel] = useState<
    "High" | "Medium" | "Low" | null
  >(null);
  const [isSavingImpact, setIsSavingImpact] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [complianceDeadline, setComplianceDeadline] = useState("");
  const [allDrugs, setAllDrugs] = useState<any[]>([]);

  // Realtime Users State
  const [realtimeUsers, setRealtimeUsers] = useState<any[]>([]);

  const [isPending, startTransition] = React.useTransition();

  useEffect(() => {
    async function loadUsers() {
      try {
        const users = await getRealtimeUsers();
        setRealtimeUsers(users);
      } catch (e) {
        console.error("Failed to fetch realtime users", e);
      }
    }
    loadUsers();
  }, []);

  useEffect(() => {
    async function loadRecord() {
      setIsLoading(true);
      try {
        const [data, assessment, drugsList] = await Promise.all([
          getIntelligenceRecord(recordId),
          getImpactAssessment(recordId),
          getDrugs()
        ]);
        if (data) {
          setRecord(data);
          if (data.impactLevel) setImpactLevel(data.impactLevel as any);
        }
        if (assessment) {
          setImpactLevel(assessment.impactLevel as any);
          setComplianceDeadline(assessment.complianceDeadline || "");
          try {
            setSelectedProducts(JSON.parse(assessment.affectedProducts || "[]"));
          } catch (e) {}
        }
        if (drugsList) {
          setAllDrugs(drugsList);
        }
      } catch (e) {
        console.error("Failed to load record", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadRecord();
  }, [recordId]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleTrackToggle = async () => {
    try {
      const result = await toggleRecordSubscription(recordId);
      setIsTracking(result.isTracking);
      setShowToast({
        message: result.isTracking
          ? "Successfully subscribed to updates for this record."
          : "Unsubscribed from updates.",
        type: "success",
      });
    } catch (e) {
      setShowToast({
        message: "Failed to update tracking status.",
        type: "info",
      });
    }
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setAiSummary(null);
    try {
      const result = await generateAISummary(recordId);
      setAiSummary(result.summary);
      setShowToast({ message: "AI Analysis complete.", type: "success" });
    } catch (e) {
      setShowToast({ message: "AI generation failed.", type: "info" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveImpact = async () => {
    if (!impactLevel) {
      setShowToast({
        message: "Please select an impact level before saving.",
        type: "info",
      });
      return;
    }
    setIsSavingImpact(true);
    try {
      await saveImpactAssessment(
        recordId,
        impactLevel,
        selectedProducts,
        complianceDeadline,
      );
      setShowToast({
        message: "Impact assessment saved successfully.",
        type: "success",
      });
    } catch (e) {
      setShowToast({ message: "Failed to save assessment.", type: "info" });
    } finally {
      setIsSavingImpact(false);
    }
  };

  const handleAssign = async () => {
    if (!assignee) return;
    try {
      await assignRecordReview(
        recordId,
        assignee,
        "Please review the impact on our Q4 submissions...",
      );
      setIsAssignModalOpen(false);
      setShowToast({
        message: `Record assigned to ${assignee} for review.`,
        type: "success",
      });
      setAssignee("");
    } catch (e) {
      setShowToast({ message: "Failed to assign task.", type: "info" });
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await updateIntelligenceRecord(recordId, formData);
      setIsEditRecordModalOpen(false);
      setShowToast({
        message: "Record updated successfully.",
        type: "success",
      });
      // reload record
      const data = await getIntelligenceRecord(recordId);
      setRecord(data);
    } catch (err) {
      setShowToast({ message: "Failed to update record.", type: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteIntelligenceRecord(recordId);
      setIsDeleteRecordModalOpen(false);
      setShowToast({ message: "Record deleted.", type: "error" });
      router.push("/admin/intelligence");
    } catch (err) {
      setShowToast({ message: "Failed to delete record.", type: "error" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center mt-20">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Loading Record...</p>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-8 text-center mt-20">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">
          Record Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          The regulatory record you are looking for does not exist or the link
          is invalid.
        </p>
        <button
          onClick={() => router.push("/admin/intelligence")}
          className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-all"
        >
          Go to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-6 left-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-xl dark:bg-white dark:text-slate-900"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {showToast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer transition-colors">
            Regulatory Intelligence
          </span>
          <ChevronRight className="h-4 w-4" />
          <span className="hover:text-foreground cursor-pointer transition-colors">
            Records
          </span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">{record.title}</span>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-muted px-2 py-1 rounded-full border border-border text-muted-foreground mr-2">
              Admin View
            </span>
            <button
              onClick={() => setIsEditRecordModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <Edit className="h-3.5 w-3.5" /> Edit Record
            </button>
            <button
              onClick={() => setIsDeleteRecordModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        </div>

        {/* The Header Component we built earlier */}
        <RegulatoryIntelligenceRecord
          agency={record.agency || "Unknown Agency"}
          eventType={record.title}
          sourceAuthority="Center for Devices and Radiological Health (CDRH)"
          officialDocumentNumber={record.id.split("-")[0].toUpperCase() + "-" + record.id.substring(0, 4)}
          publicationDate={record.dateString || "Unknown Date"}
          lastUpdatedDate={new Date().toLocaleDateString()}
          effectiveDate="N/A"
          status={record.status}
          systemPriority={
            record.impactLevel === "High"
              ? "Critical"
              : record.impactLevel || "Medium"
          }
          officialRegulatoryClassification="Level 1 Guidance"
          therapeuticArea="Cardiology, Neurology"
          product="Implantable Devices"
          region="United States"
          affectedStakeholder="Manufacturer"
          sourceConfidence="Verified (Official Source)"
          dataFreshness="Updated just now"
        />

        {/* Operational Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card border border-border rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTrackToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isTracking
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-200 dark:border-orange-800"
                  : "bg-muted hover:bg-muted/80 text-foreground border border-transparent"
              }`}
            >
              {isTracking ? (
                <BellRing className="h-4 w-4" />
              ) : (
                <Bell className="h-4 w-4" />
              )}
              {isTracking ? "Tracking Updates" : "Track Record"}
            </button>
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-muted hover:bg-muted/80 text-foreground transition-all"
            >
              <UserPlus className="h-4 w-4" />
              Assign Review
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setShowToast({
                  message: "Link copied to clipboard.",
                  type: "info",
                })
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button
              onClick={() =>
                window.open(
                  "https://www.fda.gov/media/119933/download",
                  "_blank",
                )
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
            >
              <Download className="h-4 w-4" />
              Download Official PDF
            </button>
          </div>
        </div>

        {/* Rich Tabbed Content */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px]">
          {/* Tab Headers */}
          <div className="flex items-center border-b border-border bg-muted/10 px-4">
            <button
              onClick={() => setActiveTab("summary")}
              className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === "summary" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <Sparkles className="h-4 w-4" />
              AI Regulatory Summary
            </button>
            <button
              onClick={() => setActiveTab("impact")}
              className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === "impact" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <FileSearch className="h-4 w-4" />
              Impact Assessment
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === "timeline" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <History className="h-4 w-4" />
              Audit Trail
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* TAB 1: AI SUMMARY */}
              {activeTab === "summary" && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        Actionable Intelligence
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        AI-generated breakdown of the official regulatory text.
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateSummary}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm border border-border hover:bg-muted transition-all disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-primary" />
                      )}
                      {isGenerating
                        ? "Analyzing..."
                        : aiSummary
                          ? "Re-analyze Document"
                          : "Generate Summary"}
                    </button>
                  </div>

                  {isGenerating ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </div>
                  ) : aiSummary ? (
                    <div className="p-6 bg-primary/5 border border-primary/10 rounded-xl whitespace-pre-line leading-relaxed text-foreground/90">
                      {aiSummary}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-medium text-foreground mb-1">
                        No summary generated yet
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                        Click generate to let our AI read the regulatory
                        document and extract the key requirements for you.
                      </p>
                      <button
                        onClick={handleGenerateSummary}
                        className="px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-sm"
                      >
                        Generate Now
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: IMPACT ASSESSMENT */}
              {activeTab === "impact" && (
                <motion.div
                  key="impact"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          Evaluate Product Impact
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Determine how this regulation affects your portfolio.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Affected Products
                          </label>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {allDrugs.length > 0 ? allDrugs.map(drug => (
                              <label key={drug.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                                <input
                                  type="checkbox"
                                  className="rounded text-primary focus:ring-primary h-4 w-4"
                                  checked={selectedProducts.includes(drug.drugName)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedProducts(prev => [...prev, drug.drugName]);
                                    } else {
                                      setSelectedProducts(prev => prev.filter(p => p !== drug.drugName));
                                    }
                                  }}
                                />
                                <div>
                                  <div className="font-medium">
                                    {drug.drugName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {drug.status}
                                  </div>
                                </div>
                              </label>
                            )) : (
                              <div className="text-sm text-muted-foreground">No products available.</div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Internal Impact Level
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {["High", "Medium", "Low"].map((level) => (
                              <button
                                key={level}
                                onClick={() => setImpactLevel(level as any)}
                                className={`py-2 rounded-md font-medium text-sm border transition-all ${
                                  impactLevel === level
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card text-foreground border-border hover:border-primary/50"
                                }`}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Internal Compliance Deadline
                          </label>
                          <input
                            type="date"
                            value={complianceDeadline}
                            onChange={(e) => setComplianceDeadline(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-xl border border-border">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Compliance Requirements
                      </h4>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>
                            Conduct gap analysis on existing device
                            cybersecurity controls against new guidance by Q2.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>
                            Update standard operating procedures (SOPs) for
                            vulnerability management.
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>
                            Ensure future premarket submissions include full
                            SBOM.
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        setImpactLevel(null);
                        setShowToast({
                          message: "Impact assessment deleted.",
                          type: "error",
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-destructive font-medium hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Assessment
                    </button>
                    <button
                      onClick={handleSaveImpact}
                      disabled={isSavingImpact}
                      className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-70"
                    >
                      {isSavingImpact ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isSavingImpact ? "Saving..." : "Save Assessment"}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: AUDIT TRAIL */}
              {activeTab === "timeline" && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-foreground">
                      Event History
                    </h3>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
                      <Plus className="h-3.5 w-3.5" /> Add Timeline Event
                    </button>
                  </div>

                  <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-border">
                    <div className="relative group">
                      <div className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-card"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Effective Date Reached
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Oct 15, 2024
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button className="text-muted-foreground hover:text-foreground">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm mt-2">
                        The guidance is now actively enforced by the FDA during
                        premarket reviews.
                      </p>
                    </div>

                    <div className="relative group">
                      <div className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-orange-500 ring-4 ring-card"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Final Guidance Published
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Oct 12, 2023
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button className="text-muted-foreground hover:text-foreground">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm mt-2">
                        FDA issued the final version of the guidance,
                        superseding the 2018 draft.
                      </p>
                    </div>

                    <div className="relative group">
                      <div className="absolute -left-8 top-1 h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700 ring-4 ring-card"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Draft Guidance Published
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Oct 18, 2018
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                          <button className="text-muted-foreground hover:text-foreground">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm mt-2">
                        Initial draft published for public comment.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAssignModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
                <h3 className="font-semibold text-foreground">
                  Assign for Review
                </h3>
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Select Team Member
                  </label>
                  <select
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select someone...</option>
                    {realtimeUsers.map((u) => (
                      <option
                        key={u.id}
                        value={`${u.firstName} ${u.lastName} (${u.title || "User"})`}
                      >
                        {u.firstName} {u.lastName} ({u.title || u.email})
                      </option>
                    ))}
                    {realtimeUsers.length === 0 && (
                      <>
                        <option value="Dr. Sarah Jenkins (RA Head)">
                          Dr. Sarah Jenkins (RA Head)
                        </option>
                        <option value="Michael Chang (Compliance)">
                          Michael Chang (Compliance)
                        </option>
                        <option value="Emma Watson (QA)">
                          Emma Watson (QA)
                        </option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    className="w-full px-3 py-2 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                    placeholder="Please review the impact on our Q4 submissions..."
                  ></textarea>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-muted/30">
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-md font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={!assignee}
                  className="px-4 py-2 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  Assign Task
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Admin Edit Record Modal */}
      <AnimatePresence>
        {isEditRecordModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditRecordModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <form onSubmit={handleUpdate}>
                <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
                  <h3 className="font-semibold text-foreground">
                    Edit Regulatory Record
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditRecordModalOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Event Type / Title
                      </label>
                      <input
                        name="title"
                        type="text"
                        defaultValue={record.title}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Agency
                      </label>
                      <input
                        name="agency"
                        type="text"
                        defaultValue={record.agency}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        System Priority (Internal Triage)
                      </label>
                      <select
                        name="impactLevel"
                        defaultValue={record.impactLevel || "Medium"}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Official Status
                      </label>
                      <input
                        name="status"
                        type="text"
                        defaultValue={record.status}
                        className="w-full px-3 py-2 rounded-md border border-border bg-background focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-muted/30">
                  <button
                    type="button"
                    onClick={() => setIsEditRecordModalOpen(false)}
                    className="px-4 py-2 rounded-md font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Admin Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteRecordModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteRecordModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <Trash2 className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">
                  Delete this record?
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Are you sure you want to permanently delete FDA-2023-S-1234?
                  This action cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setIsDeleteRecordModalOpen(false)}
                    className="flex-1 py-2 rounded-md font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-2 rounded-md font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
