import Link from "next/link";
import {
  CatalogPagination,
  CatalogSearchForm,
} from "@/components/catalog/catalog-controls";
import { ResponsiveDataList } from "@/components/ui/responsive-data-list";
import type { Drug } from "@/repositories/drugs.repository";
import { CatalogService } from "@/services/catalog.service";

export default async function DashboardDrugsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await CatalogService.listDrugs(params);
  const columns = [
    {
      header: "Drug",
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
    { header: "Generic name", accessor: "genericName" as const },
    { header: "Brand", accessor: "brandName" as const },
    { header: "Manufacturer", accessor: "manufacturer" as const },
    { header: "Status", accessor: "status" as const },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="border-b border-border pb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
          Intelligence
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Drug catalog
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Search indexed product identities and open a record for regulatory
          details.
        </p>
      </header>
      <CatalogSearchForm
        action="/admin/dashboard/drugs"
        query={params.q ?? ""}
        placeholder="Drug, ingredient, brand, or manufacturer"
      />
      <ResponsiveDataList
        data={result.items}
        columns={columns}
        keyExtractor={(drug) => drug.id}
      />
      <CatalogPagination
        action="/admin/dashboard/drugs"
        query={params.q}
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
      />
    </div>
  );
}
