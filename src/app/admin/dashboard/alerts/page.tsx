import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/auth/rbac";
import { CatalogService } from "@/services/catalog.service";
import {
  AddAlertsButtons,
  RegulatoryEventItem,
  SafetyUpdateItem,
} from "./alerts-client-components";

export default async function DashboardAlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const activity = await CatalogService.listRegulatoryActivity(params.page);
  const hasActivity =
    activity.events.length > 0 || activity.safetyUpdates.length > 0;

  const user = await getCurrentUser();
  const isAdmin = user
    ? hasPermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD)
    : false;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="border-b border-border pb-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Regulatory monitoring
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground">
              Alerts & events
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Recent events and safety notices available in the platform
              catalog.
            </p>
          </div>
          {isAdmin && <AddAlertsButtons />}
        </div>
      </header>

      {!hasActivity ? (
        <div className="border-y border-border py-12 text-center">
          <h2 className="text-base font-semibold text-foreground">
            No regulatory activity indexed
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            New authority events and safety updates will appear here when they
            are ingested.
          </p>
        </div>
      ) : (
        <div className="grid gap-10 xl:grid-cols-2">
          <section>
            <h2 className="mb-3 border-b border-border pb-3 text-lg font-semibold text-foreground">
              Regulatory events
            </h2>
            <div className="divide-y divide-neutral-200">
              {activity.events.map((event) => (
                <RegulatoryEventItem
                  key={event.id}
                  event={event}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 border-b border-border pb-3 text-lg font-semibold text-foreground">
              Safety updates
            </h2>
            <div className="divide-y divide-neutral-200">
              {activity.safetyUpdates.map((update) => (
                <SafetyUpdateItem
                  key={update.id}
                  update={update}
                  isAdmin={isAdmin}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {hasActivity && (
        <div className="flex items-center justify-between border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            Page {params.page || "1"}
          </p>
          <div className="flex gap-2">
            <Link
              href={`/admin/dashboard/alerts?page=${Math.max(1, parseInt(params.page || "1") - 1)}`}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Previous
            </Link>
            <Link
              href={`/admin/dashboard/alerts?page=${parseInt(params.page || "1") + 1}`}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Next
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
