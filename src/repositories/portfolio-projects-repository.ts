import { db } from "@/db";
import { portfolioProjects } from "@/db/schema";
import { eq, desc, ilike, or } from "drizzle-orm";

export class PortfolioProjectsRepository {
  static async getProjects(params?: {
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = db.select().from(portfolioProjects).$dynamic();

    if (params?.search) {
      query = query.where(
        or(
          ilike(portfolioProjects.title, `%${params.search}%`),
          ilike(portfolioProjects.description, `%${params.search}%`)
        )
      );
    }

    query = query.orderBy(desc(portfolioProjects.createdAt));

    if (params?.limit) {
      query = query.limit(params.limit);
    }
    
    if (params?.offset) {
      query = query.offset(params.offset);
    }

    return await query;
  }

  static async getProjectById(id: string) {
    const result = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.id, id))
      .limit(1);

    return result[0] || null;
  }

  static async createProject(data: typeof portfolioProjects.$inferInsert) {
    const result = await db
      .insert(portfolioProjects)
      .values(data)
      .returning();
    
    return result[0];
  }

  static async updateProject(id: string, data: Partial<typeof portfolioProjects.$inferInsert>) {
    const result = await db
      .update(portfolioProjects)
      .set(data)
      .where(eq(portfolioProjects.id, id))
      .returning();

    return result[0];
  }

  static async deleteProject(id: string) {
    const result = await db
      .delete(portfolioProjects)
      .where(eq(portfolioProjects.id, id))
      .returning();

    return result[0];
  }
}
