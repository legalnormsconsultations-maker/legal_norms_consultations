"use client";

import {
  ArrowLeft,
  CalendarClock,
  Check,
  ExternalLink,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  type ImportComplianceCaseView,
  importProductTypeLabels,
} from "@/lib/import-compliance.types";

export function ImportComplianceCaseDetail({
  initialCase,
}: {
  initialCase: ImportComplianceCaseView;
}) {
  const router = useRouter();
  const [caseView, setCaseView] = useState(initialCase);
  const [expiryDate, setExpiryDate] = useState(
    initialCase.importLicenseExpiresAt?.slice(0, 10) ?? "",
  );
  const [savingTask, setSavingTask] = useState("");
  const [savingExpiry, setSavingExpiry] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const groupedTasks = Map.groupBy(caseView.tasks, (task) => task.category);

  async function toggleTask(taskId: string, isComplete: boolean) {
    setSavingTask(taskId);
    setMessage("");
    try {
      const response = await fetch(
        `/api/import-compliance/${caseView.id}/tasks/${taskId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isComplete }),
        },
      );
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error ?? "Could not update task.");

      setCaseView((current) => {
        const tasks = current.tasks.map((task) =>
          task.id === taskId ? { ...task, isComplete } : task,
        );
        const requiredTasks = tasks.filter((task) => task.isRequired);
        const completedCount = requiredTasks.filter(
          (task) => task.isComplete,
        ).length;
        const readinessPercent = requiredTasks.length
          ? Math.round((completedCount / requiredTasks.length) * 100)
          : 0;
        return {
          ...current,
          tasks,
          completedCount,
          readinessPercent,
          status:
            completedCount === requiredTasks.length
              ? "READY_FOR_REVIEW"
              : "IN_PROGRESS",
        };
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update task.",
      );
    } finally {
      setSavingTask("");
    }
  }

  async function saveExpiry() {
    setSavingExpiry(true);
    setMessage("");
    try {
      const response = await fetch(`/api/import-compliance/${caseView.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ importLicenseExpiresAt: expiryDate || null }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok)
        throw new Error(result.error ?? "Could not save expiry date.");
      setCaseView((current) => ({
        ...current,
        importLicenseExpiresAt: expiryDate
          ? `${expiryDate}T00:00:00.000Z`
          : null,
      }));
      setMessage("Validity date saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save expiry date.",
      );
    } finally {
      setSavingExpiry(false);
    }
  }

  async function deleteCase() {
    if (!window.confirm("Are you sure you want to delete this case?")) return;
    setIsDeleting(true);
    setMessage("");
    try {
      const response = await fetch(`/api/import-compliance/${caseView.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? "Could not delete case.");
      }
      router.push("/admin/dashboard/import-compliance");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not delete case.",
      );
      setIsDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Link
        href="/admin/dashboard/import-compliance"
        className="inline-flex items-center gap-2 text-sm font-medium text-teal-900 hover:underline"
      >
        <ArrowLeft size={16} /> All regulatory cases
      </Link>

      <header className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
            India regulatory pathway
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            {caseView.productName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {caseView.applicantName} · {caseView.countryOfOrigin} ·{" "}
            {importProductTypeLabels[caseView.productType]}
          </p>
        </div>
        <div className="min-w-56">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Pathway readiness</span>
            <strong className="tabular-nums text-foreground">
              {caseView.completedCount}/{caseView.requiredCount}
            </strong>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-teal-700 transition-[width]"
              style={{ width: `${caseView.readinessPercent}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {caseView.readinessPercent}% complete
          </p>
        </div>
      </header>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-8">
          {[...groupedTasks.entries()].map(([category, tasks]) => (
            <section key={category}>
              <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
                <h2 className="text-base font-semibold text-foreground">
                  {category}
                </h2>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {tasks.filter((task) => task.isComplete).length}/
                  {tasks.length} done
                </span>
              </div>
              <div className="divide-y divide-neutral-200">
                {tasks.map((task) => (
                  <label key={task.id} className="flex gap-3 py-4">
                    <input
                      type="checkbox"
                      checked={task.isComplete}
                      disabled={savingTask === task.id}
                      onChange={(event) =>
                        toggleTask(task.id, event.target.checked)
                      }
                      className="mt-1 size-4 shrink-0 accent-teal-800"
                      aria-label={`Mark ${task.title} ${task.isComplete ? "incomplete" : "complete"}`}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-sm font-medium ${task.isComplete ? "text-muted-foreground line-through" : "text-foreground"}`}
                      >
                        {task.title}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                        {task.guidance}
                      </span>
                      {task.formHint && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded bg-teal-50 px-2 py-1 text-xs font-medium text-teal-900">
                          <ExternalLink size={12} /> {task.formHint}
                        </span>
                      )}
                    </span>
                    {task.isComplete && (
                      <Check
                        className="mt-1 shrink-0 text-emerald-700"
                        size={16}
                        aria-hidden="true"
                      />
                    )}
                  </label>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="space-y-6">
          <section className="border-y border-border py-5 lg:border-t-0">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarClock size={17} className="text-teal-800" /> Approval /
              permit validity
            </h2>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Record the date from the issued approval or license. The workspace
              flags dates inside 90 days.
            </p>
            <label
              className="mt-4 block text-xs font-medium text-muted-foreground"
              htmlFor="license-expiry"
            >
              Expiry / renewal date
            </label>
            <input
              id="license-expiry"
              className="mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15"
              type="date"
              value={expiryDate}
              onChange={(event) => setExpiryDate(event.target.value)}
            />
            <button
              type="button"
              onClick={saveExpiry}
              disabled={savingExpiry}
              className="mt-3 h-9 rounded-md border border-border px-3 text-sm font-medium text-foreground hover:bg-secondary disabled:opacity-60"
            >
              {savingExpiry ? "Saving..." : "Save date"}
            </button>
          </section>
          <section className="border-l-2 border-amber-500 bg-amber-50/70 p-4">
            <h2 className="text-sm font-semibold text-amber-950">
              Regulatory review required
            </h2>
            <p className="mt-2 text-xs leading-5 text-amber-900">
              This is an internal planning checklist, not a determination of
              eligibility or current filing requirements. Verify the current
              requirements with the relevant authority before submission.
            </p>
          </section>

          <section className="border-t border-border pt-5">
            <button
              type="button"
              onClick={deleteCase}
              disabled={isDeleting}
              className="flex items-center gap-2 h-9 rounded-md border border-red-900/30 bg-red-950/20 px-3 text-sm font-medium text-red-500 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/50 transition-colors disabled:opacity-60 w-full justify-center"
            >
              <Trash2 size={16} />
              {isDeleting ? "Deleting..." : "Delete case"}
            </button>
          </section>
          {message && (
            <p aria-live="polite" className="text-sm text-muted-foreground">
              {message}
            </p>
          )}
        </aside>
      </section>
    </div>
  );
}
