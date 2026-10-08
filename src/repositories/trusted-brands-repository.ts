import { eq } from "drizzle-orm";
import { db } from "@/db";
import { trustedBrands } from "@/db/schema";
import { revalidatePath } from "next/cache";

export type TrustedBrand = typeof trustedBrands.$inferSelect;
export type InsertTrustedBrand = typeof trustedBrands.$inferInsert;

export class TrustedBrandsRepository {
  static async getAllBrands() {
    return await db
      .select()
      .from(trustedBrands)
      .orderBy(trustedBrands.sortOrder);
  }

  static async getActiveBrands() {
    return await db
      .select()
      .from(trustedBrands)
      .where(eq(trustedBrands.isActive, true))
      .orderBy(trustedBrands.sortOrder);
  }

  static async createBrand(data: InsertTrustedBrand) {
    const [result] = await db.insert(trustedBrands).values(data).returning();
    revalidatePath("/");
    revalidatePath("/admin/brands");
    return result;
  }

  static async updateBrand(id: string, data: Partial<InsertTrustedBrand>) {
    const [result] = await db
      .update(trustedBrands)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(trustedBrands.id, id))
      .returning();
    revalidatePath("/");
    revalidatePath("/admin/brands");
    return result;
  }

  static async deleteBrand(id: string) {
    const [result] = await db
      .delete(trustedBrands)
      .where(eq(trustedBrands.id, id))
      .returning();
    revalidatePath("/");
    revalidatePath("/admin/brands");
    return result;
  }
}
