import { eq } from "drizzle-orm";
import { db } from "@/db";
import { regulatoryDocuments } from "@/db/schema";
import { logAuditEvent } from "@/lib/audit/logger";
import type { CurrentUser } from "@/lib/auth/session";
import {
  deleteDocument,
  generateSecureDownloadUrl,
  uploadDocument,
} from "@/lib/storage";
import { CatalogRepository } from "@/repositories/catalog.repository";
export async function getDocumentDownloadUrl(
  user: CurrentUser,
  documentId: string,
  scope: "public" | "portfolio",
): Promise<string> {
  const document =
    scope === "portfolio"
      ? await CatalogRepository.findOwnedPortfolioDocument(documentId, user.id)
      : await CatalogRepository.findPublicRegulatoryDocument(documentId);

  if (!document) throw new Error("Document not found or access denied.");
  return generateSecureDownloadUrl(
    document.objectKey,
    document.bucketName,
    300,
  );
}

export async function uploadRegulatoryDocument(
  user: CurrentUser,
  file: File,
  title: string,
  documentType: string,
  drugId?: string,
  authorityId?: string,
) {
  // 1. Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 2. Upload to S3 / Object Storage
  const storageMeta = await uploadDocument({
    fileBuffer: buffer,
    mimeType: file.type,
    originalFilename: file.name,
    isPublic: true,
  });

  // 3. Save to DB
  const [newDoc] = await db
    .insert(regulatoryDocuments)
    .values({
      title,
      documentType,
      drugId: drugId || null,
      authorityId: authorityId || null,
      objectKey: storageMeta.objectKey,
      bucketName: storageMeta.bucketName,
      mimeType: storageMeta.mimeType,
      sizeBytes: storageMeta.sizeBytes,
      checksum: storageMeta.checksum,
      accessLevel: storageMeta.accessLevel,
    })
    .returning();

  // 4. Audit Log
  const requestId = `req-${user.id}-${Date.now()}`;
  await logAuditEvent(
    {
      action: "CREATE",
      resourceType: "regulatoryDocuments",
      resourceId: newDoc.id,
      afterState: newDoc,
    },
    { user, requestId },
  );

  return newDoc;
}

export async function updateRegulatoryDocument(
  user: CurrentUser,
  id: string,
  data: {
    title?: string;
    documentType?: string;
    drugId?: string | null;
    authorityId?: string | null;
  },
) {
  const [doc] = await db
    .select()
    .from(regulatoryDocuments)
    .where(eq(regulatoryDocuments.id, id));
  if (!doc) throw new Error("Document not found");

  const [updatedDoc] = await db
    .update(regulatoryDocuments)
    .set({
      title: data.title ?? doc.title,
      documentType: data.documentType ?? doc.documentType,
      drugId: data.drugId !== undefined ? data.drugId : doc.drugId,
      authorityId:
        data.authorityId !== undefined ? data.authorityId : doc.authorityId,
    })
    .where(eq(regulatoryDocuments.id, id))
    .returning();

  const requestId = `req-${user.id}-${Date.now()}`;
  await logAuditEvent(
    {
      action: "UPDATE",
      resourceType: "regulatoryDocuments",
      resourceId: updatedDoc.id,
      beforeState: doc,
      afterState: updatedDoc,
    },
    { user, requestId },
  );

  return updatedDoc;
}

export async function deleteRegulatoryDocument(user: CurrentUser, id: string) {
  const [doc] = await db
    .select()
    .from(regulatoryDocuments)
    .where(eq(regulatoryDocuments.id, id));
  if (!doc) throw new Error("Document not found");

  // 1. Delete from storage
  await deleteDocument(doc.objectKey, doc.bucketName);

  // 2. Delete from DB
  await db.delete(regulatoryDocuments).where(eq(regulatoryDocuments.id, id));

  // 3. Audit Log
  const requestId = `req-${user.id}-${Date.now()}`;
  await logAuditEvent(
    {
      action: "DELETE",
      resourceType: "regulatoryDocuments",
      resourceId: id,
      beforeState: doc,
    },
    { user, requestId },
  );

  return true;
}
