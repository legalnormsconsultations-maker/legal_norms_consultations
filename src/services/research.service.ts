import { eq } from "drizzle-orm";
import { db } from "@/db";
import { researchArticles } from "@/db/schema";

export const ResearchService = {
  async create(data: {
    title: string;
    abstract?: string;
    authors?: any;
    categories?: any;
    publicationDate?: Date;
    publisher?: string;
    doi?: string;
    citation?: string;
    url?: string;
  }) {
    const [created] = await db
      .insert(researchArticles)
      .values(data)
      .returning();
    return created;
  },

  async update(
    id: string,
    data: {
      title?: string;
      abstract?: string;
      authors?: any;
      categories?: any;
      publicationDate?: Date;
      publisher?: string;
      doi?: string;
      citation?: string;
      url?: string;
    },
  ) {
    const [updated] = await db
      .update(researchArticles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(researchArticles.id, id))
      .returning();
    if (!updated) throw new Error("Research article not found");
    return updated;
  },

  async remove(id: string) {
    const [deleted] = await db
      .delete(researchArticles)
      .where(eq(researchArticles.id, id))
      .returning({ id: researchArticles.id });
    if (!deleted) throw new Error("Research article not found");
  },
};
