import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/auth/rbac";
import { ManufacturerCreateClient } from "./manufacturer-create-client";

export default async function NewManufacturerPage() {
  const user = await getCurrentUser();
  if (!user || !hasPermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD)) {
    redirect("/admin/dashboard/manufacturers");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="border-b border-border pb-5">
        <h1 className="mt-2 text-2xl font-semibold text-foreground">
          Add Manufacturer
        </h1>
      </header>

      <ManufacturerCreateClient />
    </div>
  );
}
