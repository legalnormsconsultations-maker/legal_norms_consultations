"use server";

import { SiteSettingsRepository } from "@/repositories/site-settings-repository";
import { revalidatePath } from "next/cache";

export async function updateSiteSettings(data: any) {
  await SiteSettingsRepository.updateSettings(data);
  revalidatePath("/", "layout");
  return { success: true };
}

export async function getSiteSettings() {
  return await SiteSettingsRepository.getSettings();
}
