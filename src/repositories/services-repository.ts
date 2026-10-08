import { eq, ilike, and, desc, isNull } from "drizzle-orm";
import { db } from "../db";
import { services, authorities } from "../db/schema";
import { z } from "zod";

// Zod schemas for validation
export const ServiceCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  authorityId: z.string().uuid().optional(),
  parentId: z.string().uuid().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["Draft", "Published", "Archived"]).default("Draft"),
});

export type ServiceInsert = z.infer<typeof ServiceCreateSchema>;

export class ServicesRepository {
  /**
   * Fetches a service by its slug, including its parent and authority
   */
  static async getServiceBySlug(slug: string) {
    const result = await db
      .select({
        service: services,
        authority: authorities,
      })
      .from(services)
      .leftJoin(authorities, eq(services.authorityId, authorities.id))
      .where(eq(services.slug, slug))
      .limit(1);

    return result[0] ?? null;
  }

  /**
   * Retrieves top-level services with pagination and optional search
   */
  static async getTopLevelServices(params: {
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    const { limit = 20, offset = 0, search } = params;

    const conditions = [isNull(services.parentId)];
    
    if (search) {
      conditions.push(ilike(services.name, `%${search}%`));
    }

    return await db
      .select()
      .from(services)
      .where(and(...conditions))
      .orderBy(desc(services.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Retrieves all child services (sub-services) for a given parent ID
   */
  static async getSubServices(parentId: string) {
    return await db
      .select()
      .from(services)
      .where(eq(services.parentId, parentId))
      .orderBy(services.name);
  }

  /**
   * Creates a new service with advanced validation
   */
  static async createService(data: ServiceInsert) {
    const validatedData = ServiceCreateSchema.parse(data);
    
    const [newService] = await db
      .insert(services)
      .values(validatedData)
      .returning();

    return newService;
  }

  /**
   * Updates an existing service
   */
  static async updateService(id: string, data: Partial<ServiceInsert>) {
    const [updatedService] = await db
      .update(services)
      .set(data)
      .where(eq(services.id, id))
      .returning();

    return updatedService;
  }

  /**
   * Deletes a service
   */
  static async deleteService(id: string) {
    const [deletedService] = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();

    return deletedService;
  }
}
