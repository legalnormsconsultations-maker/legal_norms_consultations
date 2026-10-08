import { eq } from "drizzle-orm";
import { Download, ExternalLink, FileText, Lock } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db";
import { regulatoryDocuments } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { getDocumentDownloadUrl } from "@/services/documents.service";

export default async function DocumentDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch Document Metadata
  const [doc] = await db
    .select()
    .from(regulatoryDocuments)
    .where(eq(regulatoryDocuments.id, params.id))
    .limit(1);

  if (!doc) {
    notFound();
  }

  // 2. Generate Secure Time-Limited Download URL
  let secureUrl: string;
  try {
    secureUrl = await getDocumentDownloadUrl(user, doc.id, "public"); // 'public' refers to regulatory docs
  } catch (e) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 px-6">
        <Lock className="w-16 h-16 text-red-500 mb-2" />
        <h1 className="text-3xl font-bold text-white">Access Denied</h1>
        <p className="text-neutral-400 max-w-md">
          You do not have the required permissions or organization access to
          view this document.
        </p>
        <Link
          href="/admin/dashboard"
          className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Bar */}
      <div className="h-16 border-b border-neutral-800 bg-black/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-900 rounded-md">
            <FileText className="w-5 h-5 text-neutral-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white leading-tight">
              {doc.title}
            </h1>
            <div className="text-xs text-muted-foreground font-medium">
              {doc.documentType.toUpperCase()} •{" "}
              {(doc.sizeBytes / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={secureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg text-sm font-medium transition-colors border border-neutral-800"
          >
            <ExternalLink size={16} /> Open Externally
          </a>
          <a
            href={secureUrl}
            download={doc.title}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} /> Download Source
          </a>
        </div>
      </div>

      {/* PDF Viewer / Document Container */}
      <div className="flex-1 bg-neutral-950 p-4 sm:p-6 lg:p-8">
        <div className="w-full h-full max-w-6xl mx-auto bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center min-h-[70vh]">
          {doc.mimeType === "application/pdf" ? (
            <iframe
              src={`${secureUrl}#toolbar=0&navpanes=0`}
              className="w-full h-[85vh] border-0 rounded-xl"
              title={doc.title}
            />
          ) : (
            <div className="text-center">
              <FileText className="w-20 h-20 text-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white">
                Preview Not Available
              </h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                This document format ({doc.mimeType}) cannot be previewed
                natively in the browser. Please download the file to view it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
