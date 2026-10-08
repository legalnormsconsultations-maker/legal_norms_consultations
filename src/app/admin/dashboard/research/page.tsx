import {
  CatalogPagination,
  CatalogSearchForm,
} from "@/components/catalog/catalog-controls";
import { getCurrentUser } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/auth/rbac";
import { CatalogService } from "@/services/catalog.service";
import {
  AddResearchButton,
  ResearchArticleItem,
} from "./research-client-components";

export default async function DashboardResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const result = await CatalogService.listResearch(params);
  const { items: articles } = result;

  const user = await getCurrentUser();
  const isAdmin = user
    ? hasPermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD)
    : false;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="border-b border-border pb-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
              Scientific references
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-foreground">
              Research library
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse indexed research with its source, publication date, and
              citation metadata.
            </p>
          </div>
          {isAdmin && <AddResearchButton />}
        </div>
      </header>
      <CatalogSearchForm
        action="/admin/dashboard/research"
        query={params.q ?? ""}
        placeholder="Title, abstract, or publisher"
      />
      {articles.length ? (
        <div className="divide-y divide-neutral-200">
          {articles.map((article) => (
            <ResearchArticleItem
              key={article.id}
              article={article}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="border-y border-border py-12 text-center">
          <h2 className="text-base font-semibold text-foreground">
            No indexed research yet
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Only sourced publications are shown here; citations are never
            generated.
          </p>
        </div>
      )}
      <CatalogPagination
        action="/admin/dashboard/research"
        query={params.q}
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
      />
    </div>
  );
}
