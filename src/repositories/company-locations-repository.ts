import { eq } from "drizzle-orm";
import { db } from "@/db";
import { companyLocations } from "@/db/consultancy-schema";
import { revalidatePath } from "next/cache";

export type CompanyLocation = typeof companyLocations.$inferSelect;
export type InsertCompanyLocation = typeof companyLocations.$inferInsert;

export class CompanyLocationsRepository {
  static async getAllLocations() {
    return await db
      .select()
      .from(companyLocations)
      .orderBy(companyLocations.sortOrder);
  }

  static async getActiveLocations() {
    return await db
      .select()
      .from(companyLocations)
      .where(eq(companyLocations.isActive, true))
      .orderBy(companyLocations.sortOrder);
  }

  static async createLocation(data: InsertCompanyLocation) {
    if (data.isPrimary) {
      // If this is set as primary, unset others (simplified approach)
      await db.update(companyLocations).set({ isPrimary: false });
    }
    const [result] = await db.insert(companyLocations).values(data).returning();
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/admin/locations");
    return result;
  }

  static async updateLocation(id: string, data: Partial<InsertCompanyLocation>) {
    if (data.isPrimary) {
      await db.update(companyLocations).set({ isPrimary: false });
    }
    const [result] = await db
      .update(companyLocations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(companyLocations.id, id))
      .returning();
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/admin/locations");
    return result;
  }

  static async deleteLocation(id: string) {
    const [result] = await db
      .delete(companyLocations)
      .where(eq(companyLocations.id, id))
      .returning();
    revalidatePath("/");
    revalidatePath("/contact");
    revalidatePath("/admin/locations");
    return result;
  }
}
