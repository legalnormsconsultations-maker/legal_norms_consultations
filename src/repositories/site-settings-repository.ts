import { db } from "@/db";
import { siteSettings } from "@/db/consultancy-schema";
import { eq } from "drizzle-orm";

export class SiteSettingsRepository {
  static async getSettings() {
    const settingsList = await db.select().from(siteSettings).limit(1);
    if (settingsList.length === 0) {
      return null;
    }
    return settingsList[0];
  }

  static async updateSettings(data: Partial<typeof siteSettings.$inferInsert>) {
    const existing = await this.getSettings();
    if (existing) {
      const [updated] = await db
        .update(siteSettings)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(siteSettings)
        .values(data as any)
        .returning();
      return created;
    }
  }
}
