import { db } from "@/db";
import { pageContents } from "@/db/schema";
import { eq } from "drizzle-orm";

export class PageContentsRepository {
  static async getPageContent(pageName: string) {
    const pages = await db
      .select()
      .from(pageContents)
      .where(eq(pageContents.pageName, pageName))
      .limit(1);
    
    if (pages.length === 0) {
      return null;
    }
    return pages[0];
  }

  static async updatePageContent(pageName: string, richTextContent: string) {
    const existing = await this.getPageContent(pageName);
    
    if (existing) {
      const [updated] = await db
        .update(pageContents)
        .set({ richTextContent, updatedAt: new Date() })
        .where(eq(pageContents.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(pageContents)
        .values({
          pageName,
          richTextContent,
          isActive: true,
        })
        .returning();
      return created;
    }
  }
}
