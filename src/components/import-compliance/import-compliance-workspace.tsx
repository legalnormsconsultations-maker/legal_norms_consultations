"use client";

import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Plus,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import {
  type ImportComplianceCaseView,
  type ImportProductType,
  importProductTypeLabels,
} from "@/lib/import-compliance.types";

const inputClassName =
  "mt-1 h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15";

function expiryLabel(value: string | null) {
  if (!value) return null;
  const days = Math.ceil((new Date(value).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return { label: "Expired", tone: "text-red-700 bg-red-50" };
  if (days <= 90)
    return { label: `Expires in ${days}d`, tone: "text-amber-800 bg-amber-50" };
  return {
    label: `Valid to ${new Date(value).toLocaleDateString()}`,
    tone: "text-muted-foreground bg-muted",
  };
}

export function ImportComplianceWorkspace({
  initialCases,
}: {
  initialCases: ImportComplianceCaseView[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [productType, setProductType] = useState<ImportProductType>("DRUG");
  const drugLike = ["DRUG", "BIOLOGICAL", "API"].includes(productType);
  const clinicalTrialRoute = [
    "DRUG",
    "BIOLOGICAL",
    "MEDICAL_DEVICE",
    "IVD",
  ].includes(productType);

  const filteredCases = initialCases.filter((item) => {
    if (filter === "ALL") return true;
    if (filter === "RENEWAL") {
      if (!item.importLicenseExpiresAt) return false;
      const days =
        (new Date(item.importLicenseExpiresAt).getTime() - Date.now()) /
        86_400_000;
      return days <= 90;
    }
    return item.status === filter;
  });
  const renewalCount = initialCases.filter((item) => {
    if (!item.importLicenseExpiresAt) return false;
    return (
      (new Date(item.importLicenseExpiresAt).getTime() - Date.now()) /
        86_400_000 <=
      90
    );
  }).length;
  const openTasks = initialCases.reduce(
    (total, item) => total + item.requiredCount - item.completedCount,
    0,
  );

  async function createCase(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/import-compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.get("productName"),
          applicantName: form.get("applicantName"),
          countryOfOrigin: form.get("countryOfOrigin"),
          productType: form.get("productType"),
          isScheduleX: form.has("isScheduleX"),
          isNewDrug: form.has("isNewDrug"),
          isFixedDoseCombination: form.has("isFixedDoseCombination"),
          isClinicalTrialImport: form.has("isClinicalTrialImport"),
          isForTesting: form.has("isForTesting"),
          hasWholesaleLicense: form.has("hasWholesaleLicense"),
          hasAuthorizedAgent: form.has("hasAuthorizedAgent"),
          hasImportExportCode: form.has("hasImportExportCode"),
          importLicenseExpiresAt:
            String(form.get("importLicenseExpiresAt") ?? "") || null,
        }),
      });
      const result = (await response.json()) as {
        case?: { id: string };
        error?: string;
      };
      if (!response.ok || !result.case) {
        throw new Error(
          result.error ?? "Could not create the compliance case.",
        );
      }
      router.push(`/dashboard/import-compliance/${result.case.id}`);
      router.refresh();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Could not create the regulatory case.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
            India market entry & compliance
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            Regulatory pathway workspace
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Map product-specific approvals, importer readiness, and lifecycle
            obligations across Indian regulators.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((value) => !value)}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-teal-900 px-4 text-sm font-semibold text-white hover:bg-teal-800"
        >
          <Plus size={16} />
          {showForm ? "Close intake" : "New regulatory case"}
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric
          label="Tracked cases"
          value={String(initialCases.length)}
          icon={<ClipboardList size={18} />}
        />
        <Metric
          label="Open checklist items"
          value={String(openTasks)}
          icon={<CheckCircle2 size={18} />}
        />
        <Metric
          label="Renewals within 90 days"
          value={String(renewalCount)}
          icon={<CalendarClock size={18} />}
        />
      </div>

      {showForm && (
        <section className="border-y border-border bg-secondary/70 px-4 py-6 sm:px-6">
          <div className="mb-5 max-w-2xl">
            <h2 className="text-lg font-semibold text-foreground">
              Start a product case
            </h2>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Your answers tailor an internal readiness checklist. Regulatory
              form references are prompts to verify, not legal advice.
            </p>
          </div>
          <form onSubmit={createCase} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Field label="Product name" name="productName" required />
              <Field
                label="Applicant / importer entity"
                name="applicantName"
                required
              />
              <Field
                label="Country of origin / manufacture"
                name="countryOfOrigin"
                required
              />
              <label className="block text-sm font-medium text-foreground">
                Product / service category
                <select
                  className={inputClassName}
                  name="productType"
                  value={productType}
                  onChange={(event) =>
                    setProductType(event.target.value as ImportProductType)
                  }
                >
                  {Object.entries(importProductTypeLabels).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </label>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-foreground">
                Pathway indicators
              </legend>
              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {productType === "DRUG" && (
                  <Check name="isScheduleX" label="Schedule X product" />
                )}
                {drugLike && (
                  <Check name="isNewDrug" label="New drug / new indication" />
                )}
                {productType === "DRUG" && (
                  <Check
                    name="isFixedDoseCombination"
                    label="Fixed-dose combination"
                  />
                )}
                {clinicalTrialRoute && (
                  <Check
                    name="isClinicalTrialImport"
                    label="Clinical-trial or evaluation import"
                  />
                )}
                <Check
                  name="isForTesting"
                  label="Import for testing or analysis"
                />
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-foreground">
                Applicant readiness
              </legend>
              <div className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {["DRUG", "BIOLOGICAL", "API", "VETERINARY"].includes(
                  productType,
                ) && (
                  <Check
                    name="hasWholesaleLicense"
                    label="Relevant wholesale license is in place"
                  />
                )}
                <Check
                  name="hasAuthorizedAgent"
                  label="Local agent / representative is in place if required"
                />
                <Check
                  name="hasImportExportCode"
                  label="Importer Exporter Code is available"
                />
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-[minmax(220px,320px)_1fr] sm:items-end">
              <label className="block text-sm font-medium text-foreground">
                Current approval / license expiry, if applicable
                <input
                  className={inputClassName}
                  name="importLicenseExpiresAt"
                  type="date"
                />
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={busy}
                  className="h-10 rounded-md bg-teal-900 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
                >
                  {busy ? "Creating case..." : "Create case and checklist"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="h-10 rounded-md border border-border px-4 text-sm font-medium text-muted-foreground hover:bg-card"
                >
                  Cancel
                </button>
                {error && (
                  <p role="alert" className="text-sm text-red-700">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </form>
        </section>
      )}

      <section>
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Product cases
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Checklist progress and approval validity for your organization.
            </p>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Show</span>
            <select
              className="h-9 rounded-md border border-border bg-card px-2 text-sm"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="ALL">All cases</option>
              <option value="DRAFT">Draft</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="READY_FOR_REVIEW">Ready for review</option>
              <option value="RENEWAL">Renewal due</option>
            </select>
          </label>
        </div>

        {filteredCases.length === 0 ? (
          <div className="py-12 text-center">
            <ShieldAlert className="mx-auto text-teal-800" size={28} />
            <h3 className="mt-3 text-base font-semibold text-foreground">
              {initialCases.length
                ? "No cases match this filter"
                : "No regulatory cases yet"}
            </h3>
            <p className="mx-auto mt-1 max-w-md text-sm leading-5 text-muted-foreground">
              {initialCases.length
                ? "Choose another case status to continue."
                : "Start with one product or compliance area. The workspace will create a category-specific checklist."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200">
            {filteredCases.map((item) => {
              const expiry = expiryLabel(item.importLicenseExpiresAt);
              return (
                <Link
                  key={item.id}
                  href={`/admin/dashboard/import-compliance/${item.id}`}
                  className="grid gap-4 py-5 transition-colors hover:bg-secondary sm:grid-cols-[minmax(0,1.5fr)_minmax(160px,0.8fr)_minmax(160px,0.8fr)_auto] sm:items-center sm:px-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {item.productName}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {item.applicantName} · {item.countryOfOrigin} ·{" "}
                      {importProductTypeLabels[item.productType]}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground sm:justify-start sm:gap-3">
                      <span>Readiness</span>
                      <span className="font-semibold text-foreground">
                        {item.completedCount}/{item.requiredCount}
                      </span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-200">
                      <div
                        className="h-full rounded-full bg-teal-700"
                        style={{ width: `${item.readinessPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {item.status.replaceAll("_", " ").toLowerCase()}
                    </span>
                    {expiry && (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${expiry.tone}`}
                      >
                        {expiry.label}
                      </span>
                    )}
                  </div>
                  <ArrowRight
                    className="hidden text-neutral-400 sm:block"
                    size={18}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <p className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        Planning workspace only. Requirements and form applicability can change
        and vary by product. Confirm the current CDSCO/SUGAM checklist and
        obtain qualified regulatory review before filing.
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border py-3 sm:border-b-0 sm:border-r sm:pr-4">
      <span className="flex size-9 items-center justify-center rounded-md bg-teal-50 text-teal-900">
        {icon}
      </span>
      <span>
        <span className="block text-xl font-semibold tabular-nums text-foreground">
          {value}
        </span>
        <span className="block text-xs text-muted-foreground">{label}</span>
      </span>
    </div>
  );
}

function Field({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-foreground">
      {label}
      <input
        className={inputClassName}
        name={name}
        required={required}
        maxLength={255}
      />
    </label>
  );
}

function Check({ name, label }: { name: string; label: string }) {
  return (
    <label className="flex items-start gap-2 text-sm text-muted-foreground">
      <input
        className="mt-0.5 size-4 accent-teal-800"
        type="checkbox"
        name={name}
      />
      <span>{label}</span>
    </label>
  );
}
