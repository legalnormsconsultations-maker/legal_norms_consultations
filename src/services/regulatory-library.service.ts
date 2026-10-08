import { eq } from "drizzle-orm";
import { db } from "@/db";
import { regulatoryResources } from "@/db/schema";

export const RegulatoryLibraryService = {
  async list() {
    return db
      .select()
      .from(regulatoryResources)
      .orderBy(regulatoryResources.title);
  },

  async create(data: {
    authority: string;
    title: string;
    url: string;
    description: string;
    category: string;
  }) {
    const [created] = await db
      .insert(regulatoryResources)
      .values(data)
      .returning();
    return created;
  },

  async update(
    id: string,
    data: {
      authority?: string;
      title?: string;
      url?: string;
      description?: string;
      category?: string;
    },
  ) {
    const [updated] = await db
      .update(regulatoryResources)
      .set({ ...data })
      .where(eq(regulatoryResources.id, id))
      .returning();
    if (!updated) throw new Error("Resource not found");
    return updated;
  },

  async remove(id: string) {
    const [deleted] = await db
      .delete(regulatoryResources)
      .where(eq(regulatoryResources.id, id))
      .returning({ id: regulatoryResources.id });
    if (!deleted) throw new Error("Resource not found");
  },
};
