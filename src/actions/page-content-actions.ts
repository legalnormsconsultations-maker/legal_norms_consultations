"use server";

import { db } from "@/db";
import { pageContents } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getPageContents(pageName?: string) {
  if (pageName) {
    return await db.query.pageContents.findMany({
      where: eq(pageContents.pageName, pageName),
      orderBy: (contents, { asc }) => [asc(contents.sortOrder)],
    });
  }
  return await db.query.pageContents.findMany({
    orderBy: (contents, { asc }) => [asc(contents.sortOrder)],
  });
}

export async function createPageContent(data: {
  pageName: string;
  category?: string | null;
  subcategory?: string | null;
  bundle?: string | null;
  pagination?: string | null;
  title?: string | null;
  description?: string | null;
  richTextContent?: string | null;
  mediaUrl?: string | null;
  mediaType?: string | null;
  cardType?: string;
  cardWidth?: string | null;
  cardHeight?: string | null;
  mediaWidth?: string | null;
  mediaHeight?: string | null;
  imageUrl?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (!currentUser.roles.includes("SUPER_ADMIN") && !currentUser.roles.includes("ADMIN"))) {
    return { error: "Unauthorized" };
  }

  await db.insert(pageContents).values({
    ...data,
    cardType: data.cardType ?? "normal",
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
  });

  revalidatePath(`/admin/content`);
  revalidatePath(`/${data.pageName}`);
  return { success: true };
}

export async function updatePageContent(
  id: string,
  data: {
    pageName?: string;
    category?: string | null;
    subcategory?: string | null;
    bundle?: string | null;
    pagination?: string | null;
    title?: string | null;
    description?: string | null;
    richTextContent?: string | null;
    mediaUrl?: string | null;
    mediaType?: string | null;
    cardType?: string;
    cardWidth?: string | null;
    cardHeight?: string | null;
    mediaWidth?: string | null;
    mediaHeight?: string | null;
    imageUrl?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (!currentUser.roles.includes("SUPER_ADMIN") && !currentUser.roles.includes("ADMIN"))) {
    return { error: "Unauthorized" };
  }

  const existing = await db.query.pageContents.findFirst({
    where: eq(pageContents.id, id),
  });

  if (!existing) {
    return { error: "Not found" };
  }

  const updateData = { ...data, updatedAt: new Date() };
  if (updateData.cardType === undefined) {
    delete updateData.cardType;
  }

  await db
    .update(pageContents)
    .set(updateData)
    .where(eq(pageContents.id, id));

  revalidatePath(`/admin/content`);
  if (existing.pageName) revalidatePath(`/${existing.pageName}`);
  if (data.pageName && data.pageName !== existing.pageName) revalidatePath(`/${data.pageName}`);
  return { success: true };
}

export async function deletePageContent(id: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || (!currentUser.roles.includes("SUPER_ADMIN") && !currentUser.roles.includes("ADMIN"))) {
    return { error: "Unauthorized" };
  }

  const existing = await db.query.pageContents.findFirst({
    where: eq(pageContents.id, id),
  });

  if (!existing) {
    return { error: "Not found" };
  }

  await db.delete(pageContents).where(eq(pageContents.id, id));

  revalidatePath(`/admin/content`);
  revalidatePath(`/${existing.pageName}`);
  return { success: true };
}
