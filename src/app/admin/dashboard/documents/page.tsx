import Link from "next/link";
import {
  CatalogPagination,
  CatalogSearchForm,
} from "@/components/catalog/catalog-controls";
import { DocumentRowActions } from "@/components/documents/document-row-actions";
import { DocumentUploadModal } from "@/components/documents/document-upload-modal";
import { ResponsiveDataList } from "@/components/ui/responsive-data-list";
import { getCurrentUser } from "@/lib/auth";
import { CatalogService } from "@/services/catalog.service";

export default async function DashboardDocumentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const [user, params] = await Promise.all([getCurrentUser(), searchParams]);
  if (!user) return null;
  const result = await CatalogService.listDocuments(user, params);
  const regulatoryColumns = [
    {
      header: "Document",
      accessor: "title" as const,
      render: (document: (typeof result.publicDocuments.items)[number]) => (
        <Link
          href={`/api/documents/${document.id}/download`}
          className="font-semibold text-teal-900 hover:underline"
        >
          {document.title}
        </Link>
      ),
    },
    { header: "Type", accessor: "documentType" as const },
    { header: "Format", accessor: "mimeType" as const },
    {
      header: "Published",
      accessor: "publishedDate" as const,
      render: (document: (typeof result.publicDocuments.items)[number]) =>
        document.publishedDate?.toLocaleDateString() ?? "Date not listed",
    },
    {
      header: "",
      accessor: "id" as const,
      render: (document: (typeof result.publicDocuments.items)[number]) => (
        <div className="flex justify-end">
          <DocumentRowActions
            documentId={document.id}
            initialTitle={document.title}
            initialDocumentType={document.documentType || ""}
          />
        </div>
      ),
    },
  ];
  const portfolioColumns = [
    {
      header: "Document",
      accessor: "title" as const,
      render: (document: (typeof result.portfolioDocuments.items)[number]) => (
        <Link
          href={`/api/documents/${document.id}/download?scope=portfolio`}
          className="font-semibold text-teal-900 hover:underline"
        >
          {document.title}
        </Link>
      ),
    },
    { header: "Type", accessor: "documentType" as const },
    { header: "Format", accessor: "mimeType" as const },
    {
      header: "Added",
      accessor: "createdAt" as const,
      render: (document: (typeof result.portfolioDocuments.items)[number]) =>
        document.createdAt.toLocaleDateString(),
    },
    {
      header: "",
      accessor: "id" as const,
      render: (document: (typeof result.portfolioDocuments.items)[number]) => (
        <div className="flex justify-end">
          <DocumentRowActions
            documentId={document.id}
            initialTitle={document.title}
            initialDocumentType={document.documentType || ""}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-800">
            Evidence & filings
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            Document library
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse public regulatory documents and your private portfolio files.
          </p>
        </div>
        <DocumentUploadModal />
      </header>
      <CatalogSearchForm
        action="/admin/dashboard/documents"
        query={params.q ?? ""}
        placeholder="Title, type, or file format"
      />

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Public regulatory documents
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Public files are shared across the platform.
          </p>
        </div>
        <ResponsiveDataList
          data={result.publicDocuments.items}
          columns={regulatoryColumns}
          keyExtractor={(item) => item.id}
        />
        <CatalogPagination
          action="/admin/dashboard/documents"
          query={params.q}
          page={result.publicDocuments.page}
          pageSize={result.publicDocuments.pageSize}
          total={result.publicDocuments.total}
        />
      </section>

      <section className="space-y-3 border-t border-border pt-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            My portfolio files
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Private files are visible only to their owner.
          </p>
        </div>
        <ResponsiveDataList
          data={result.portfolioDocuments.items}
          columns={portfolioColumns}
          keyExtractor={(item) => item.id}
        />
        <CatalogPagination
          action="/admin/dashboard/documents"
          query={params.q}
          page={result.portfolioDocuments.page}
          pageSize={result.portfolioDocuments.pageSize}
          total={result.portfolioDocuments.total}
        />
      </section>
    </div>
  );
}
