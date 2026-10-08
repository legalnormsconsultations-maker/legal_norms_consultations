import type { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import {
  CatalogPagination,
  CatalogSearchForm,
} from "@/components/catalog/catalog-controls";
import { ResponsiveDataList } from "@/components/ui/responsive-data-list";
import type { manufacturers } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/auth/rbac";
import { CatalogService } from "@/services/catalog.service";

type Manufacturer = InferSelectModel<typeof manufacturers>;

export default async function DashboardManufacturersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await CatalogService.listManufacturers(params);

  const user = await getCurrentUser();
  const isAdmin = user
    ? hasPermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD)
    : false;

  const columns = [
    {
      header: "Organization",
      accessor: "name" as const,
      render: (manufacturer: Manufacturer) => (
        <Link
          href={`/admin/dashboard/manufacturers/${manufacturer.id}`}
          className="font-semibold text-teal-900 hover:underline"
        >
          {manufacturer.name}
        </Link>
      ),
    },
    { header: "Country", accessor: "country" as const },
    { header: "Headquarters", accessor: "headquarters" as const },
    {
      header: "Website",
      accessor: "websiteUrl" as const,
      render: (manufacturer: Manufacturer) =>
        manufacturer.websiteUrl ? (
          <a
            href={manufacturer.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-900 hover:underline"
          >
            Open website
          </a>
        ) : (
          "Not listed"
        ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="border-b border-border pb-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Company directory
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground">
              Manufacturers
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse manufacturer records and linked product portfolios.
            </p>
          </div>
          {isAdmin && (
            <Link
              href="/admin/dashboard/manufacturers/new"
              className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800 text-sm font-medium"
            >
              + Add Manufacturer
            </Link>
          )}
        </div>
      </header>
      <CatalogSearchForm
        action="/admin/dashboard/manufacturers"
        query={params.q ?? ""}
        placeholder="Organization, country, or headquarters"
      />
      <ResponsiveDataList
        data={result.items}
        columns={columns}
        keyExtractor={(item) => item.id}
      />
      <CatalogPagination
        action="/admin/dashboard/manufacturers"
        query={params.q}
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
      />
    </div>
  );
}
