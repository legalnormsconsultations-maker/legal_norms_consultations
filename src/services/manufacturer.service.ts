import { eq } from "drizzle-orm";
import { db } from "@/db";
import { manufacturers } from "@/db/schema";

export const ManufacturerService = {
  async create(data: {
    name: string;
    logoUrl?: string;
    companyProfile?: string;
    headquarters?: string;
    country?: string;
    websiteUrl?: string;
    manufacturingSites?: any;
  }) {
    const [created] = await db.insert(manufacturers).values(data).returning();
    return created;
  },

  async update(
    id: string,
    data: {
      name?: string;
      logoUrl?: string;
      companyProfile?: string;
      headquarters?: string;
      country?: string;
      websiteUrl?: string;
      manufacturingSites?: any;
    },
  ) {
    const [updated] = await db
      .update(manufacturers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(manufacturers.id, id))
      .returning();
    if (!updated) throw new Error("Manufacturer not found");
    return updated;
  },

  async remove(id: string) {
    const [deleted] = await db
      .delete(manufacturers)
      .where(eq(manufacturers.id, id))
      .returning({ id: manufacturers.id });
    if (!deleted) throw new Error("Manufacturer not found");
  },
};
