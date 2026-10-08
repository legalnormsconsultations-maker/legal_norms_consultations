import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDocumentDownloadUrl } from "@/services/documents.service";

export async function GET(
  request: Request,
  context: { params: Promise<{ documentId: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Sign in required." }, { status: 401 });

  const { documentId } = await context.params;
  const scope =
    new URL(request.url).searchParams.get("scope") === "portfolio"
      ? "portfolio"
      : "public";
  try {
    const downloadUrl = await getDocumentDownloadUrl(user, documentId, scope);
    return NextResponse.redirect(downloadUrl);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Document unavailable.";
    const status =
      message === "Document not found or access denied." ? 404 : 503;
    return Response.json(
      { error: status === 404 ? message : "Document storage is unavailable." },
      { status },
    );
  }
}
