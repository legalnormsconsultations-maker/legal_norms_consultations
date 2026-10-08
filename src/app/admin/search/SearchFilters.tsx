"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter } from "lucide-react";
import { useCallback } from "react";

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentType = searchParams.get("type") || "all";
  const currentJurisdiction = searchParams.get("jurisdiction") || "";
  const currentStatus = searchParams.get("status") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    router.push(pathname + "?" + createQueryString(name, value));
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("type");
    params.delete("jurisdiction");
    params.delete("status");
    params.delete("page");
    router.push(pathname + "?" + params.toString());
  };

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
          <Filter size={18} /> Filters
        </h2>
        <button
          onClick={clearFilters}
          type="button"
          className="text-sm text-primary-600 font-medium hover:text-primary-700"
        >
          Clear
        </button>
      </div>

      <div className="space-y-4">
        <FilterSection title="Entity Type">
          <FilterCheckbox
            label="All Types"
            active={currentType === "all"}
            onChange={() => handleFilterChange("type", "all")}
          />
          <FilterCheckbox
            label="Drugs & Biologics"
            active={currentType === "drug"}
            onChange={() => handleFilterChange("type", "drug")}
          />
          <FilterCheckbox
            label="Regulatory Documents"
            active={currentType === "document"}
            onChange={() => handleFilterChange("type", "document")}
          />
          <FilterCheckbox
            label="Manufacturers"
            active={currentType === "manufacturer"}
            onChange={() => handleFilterChange("type", "manufacturer")}
          />
        </FilterSection>

        <FilterSection title="Jurisdiction">
          <FilterCheckbox
            label="United States (FDA)"
            active={currentJurisdiction === "us"}
            onChange={() =>
              handleFilterChange("jurisdiction", currentJurisdiction === "us" ? "" : "us")
            }
          />
          <FilterCheckbox
            label="European Union (EMA)"
            active={currentJurisdiction === "eu"}
            onChange={() =>
              handleFilterChange("jurisdiction", currentJurisdiction === "eu" ? "" : "eu")
            }
          />
          <FilterCheckbox
            label="United Kingdom (MHRA)"
            active={currentJurisdiction === "uk"}
            onChange={() =>
              handleFilterChange("jurisdiction", currentJurisdiction === "uk" ? "" : "uk")
            }
          />
        </FilterSection>

        <FilterSection title="Approval Status">
          <FilterCheckbox
            label="Approved"
            active={currentStatus === "approved"}
            onChange={() =>
              handleFilterChange("status", currentStatus === "approved" ? "" : "approved")
            }
          />
          <FilterCheckbox
            label="Under Review"
            active={currentStatus === "review"}
            onChange={() =>
              handleFilterChange("status", currentStatus === "review" ? "" : "review")
            }
          />
          <FilterCheckbox
            label="Withdrawn"
            active={currentStatus === "withdrawn"}
            onChange={() =>
              handleFilterChange("status", currentStatus === "withdrawn" ? "" : "withdrawn")
            }
          />
        </FilterSection>
      </div>
    </aside>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function FilterCheckbox({
  label,
  active,
  onChange,
}: {
  label: string;
  active: boolean;
  onChange: () => void;
}) {
  const id = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-filter`;

  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer group"
    >
      <input
        id={id}
        type="checkbox"
        checked={active}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
          active
            ? "bg-primary-600 border-primary-600"
            : "border-border group-hover:border-primary-400"
        }`}
      >
        {active && <span className="w-2 h-2 bg-card rounded-sm" />}
      </span>
      <span className="text-sm text-muted-foreground group-hover:text-foreground">
        {label}
      </span>
    </label>
  );
}
