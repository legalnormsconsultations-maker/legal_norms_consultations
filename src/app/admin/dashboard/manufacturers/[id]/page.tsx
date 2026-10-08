import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/auth/rbac";
import { CatalogService } from "@/services/catalog.service";
import { ManufacturerDetailClient } from "./manufacturer-detail-client";

export default async function ManufacturerDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const manufacturer = await CatalogService.getManufacturerDetail(id);
  if (!manufacturer) return notFound();

  const user = await getCurrentUser();
  const isAdmin = user
    ? hasPermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD)
    : false;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="border-b border-border pb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
          Manufacturer Profile
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-foreground">
          {manufacturer.name}
        </h1>
      </header>

      <ManufacturerDetailClient manufacturer={manufacturer} isAdmin={isAdmin} />
    </div>
  );
}
