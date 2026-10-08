"use server";

import { PageContentsRepository } from "@/repositories/page-contents-repository";
import { revalidatePath } from "next/cache";

export async function getLegalPage(pageName: string) {
  return await PageContentsRepository.getPageContent(pageName);
}

export async function updateLegalPage(pageName: string, content: string) {
  console.log(`[updateLegalPage] Saving ${pageName}... Content length: ${content?.length}`);
  try {
    const updated = await PageContentsRepository.updatePageContent(pageName, content);
    console.log(`[updateLegalPage] Successfully saved ${pageName}. ID:`, updated?.id);
    revalidatePath(`/${pageName}`);
    revalidatePath("/admin/legal");
    return { success: true };
  } catch (error) {
    console.error(`[updateLegalPage] Error saving ${pageName}:`, error);
    throw error;
  }
}
