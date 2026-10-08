import { eq } from "drizzle-orm";
import { db } from "@/db";
import { clientTestimonials } from "@/db/consultancy-schema";
import { revalidatePath } from "next/cache";

export type ClientTestimonial = typeof clientTestimonials.$inferSelect;
export type InsertClientTestimonial = typeof clientTestimonials.$inferInsert;

export class ClientTestimonialsRepository {
  static async getAllTestimonials() {
    return await db
      .select()
      .from(clientTestimonials)
      .orderBy(clientTestimonials.sortOrder);
  }

  static async getActiveTestimonials() {
    return await db
      .select()
      .from(clientTestimonials)
      .where(eq(clientTestimonials.isActive, true))
      .orderBy(clientTestimonials.sortOrder);
  }

  static async createTestimonial(data: InsertClientTestimonial) {
    const [result] = await db.insert(clientTestimonials).values(data).returning();
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return result;
  }

  static async updateTestimonial(id: string, data: Partial<InsertClientTestimonial>) {
    const [result] = await db
      .update(clientTestimonials)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(clientTestimonials.id, id))
      .returning();
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return result;
  }

  static async deleteTestimonial(id: string) {
    const [result] = await db
      .delete(clientTestimonials)
      .where(eq(clientTestimonials.id, id))
      .returning();
    revalidatePath("/");
    revalidatePath("/admin/testimonials");
    return result;
  }
}
