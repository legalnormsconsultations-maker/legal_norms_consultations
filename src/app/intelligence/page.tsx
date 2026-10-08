import { Activity, ArrowRight, Pill, ShieldAlert } from "lucide-react";
import Link from "next/link";
import {
  CatalogPagination,
  CatalogSearchForm,
} from "@/components/catalog/catalog-controls";
import { ResponsiveDataList } from "@/components/ui/responsive-data-list";
import { getCurrentUser } from "@/lib/auth";
import type { Drug } from "@/repositories/drugs.repository";
import { CatalogService } from "@/services/catalog.service";

export const metadata = {
  title: "Regulatory Intelligence | Legalnorms",
  description: "Global drug regulatory intelligence and insights.",
};

export default async function IntelligencePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const result = await CatalogService.listDrugs(params);

  const columns = [
    {
      header: "Drug Name",
      accessor: "drugName" as const,
      render: (drug: Drug) => (
        <Link
          href={`/drugs/${drug.id}`}
          className="font-semibold text-teal-900 hover:underline"
        >
          {drug.drugName}
        </Link>
      ),
    },
    { header: "Generic Name", accessor: "genericName" as const },
    { header: "Brand", accessor: "brandName" as const },
    { header: "Manufacturer", accessor: "manufacturer" as const },
    {
      header: "Status",
      accessor: "status" as const,
      render: (drug: Drug) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            drug.status === "Approved"
              ? "bg-green-100 text-green-800"
              : drug.status === "Withdrawn"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {drug.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      {/* Navigation Header */}
      <header className="w-full bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="p-1.5 bg-teal-900 rounded shadow-sm">
              <Activity className="w-5 h-5 text-teal-50" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Legalnorms
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-teal-900"
            >
              Home
            </Link>
            {user ? (
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName ?? "User"}
                    className="w-9 h-9 rounded-full object-cover border border-border shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#FF9933] border border-[#E68A2E] flex items-center justify-center text-white font-semibold text-sm">
                    {user.firstName?.[0]?.toUpperCase() ??
                      user.email[0].toUpperCase()}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-semibold text-teal-900 hover:underline"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Regulatory Intelligence
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Access real-time regulatory data, clinical trial information, and
              approval statuses for thousands of pharmaceutical products
              worldwide.
            </p>
          </div>
          <div className="flex-shrink-0">
            <ShieldAlert className="w-12 h-12 text-teal-900/20" />
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-700" /> Drug Database Search
          </h2>
          <CatalogSearchForm
            action="/intelligence"
            query={params.q ?? ""}
            placeholder="Search by drug name, active ingredient, or manufacturer..."
          />
          <div className="mt-6">
            <ResponsiveDataList
              data={result.items}
              columns={columns}
              keyExtractor={(drug) => drug.id}
            />
          </div>
          <div className="mt-6 border-t border-neutral-100 pt-4">
            <CatalogPagination
              action="/intelligence"
              query={params.q}
              page={result.page}
              pageSize={result.pageSize}
              total={result.total}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
