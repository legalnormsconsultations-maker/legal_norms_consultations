import { eq, ilike, and, desc, inArray } from "drizzle-orm";
import { db } from "../db";
import { articles, authorities } from "../db/schema";
import { z } from "zod";

export const ArticleCreateSchema = z.object({
  type: z.enum(["Guide", "Blog", "Case Study", "Service Explanation"]),
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  authorityId: z.string().uuid().optional(),
  industry: z.string().optional(),
  status: z.enum(["Draft", "Internal Review", "Regulatory Review", "Approved", "Published"]).default("Draft"),
});

export type ArticleInsert = z.infer<typeof ArticleCreateSchema>;

export class ArticlesRepository {
  /**
   * Fetch paginated published articles by type (e.g., Blog or Guide)
   */
  static async getPublishedArticles(params: {
    type?: "Guide" | "Blog" | "Case Study";
    limit?: number;
    offset?: number;
    search?: string;
  }) {
    const { limit = 10, offset = 0, type, search } = params;

    const conditions = [eq(articles.status, "Published")];
    
    if (type) conditions.push(eq(articles.type, type));
    if (search) conditions.push(ilike(articles.title, `%${search}%`));

    return await db
      .select({
        article: articles,
        authority: authorities,
      })
      .from(articles)
      .leftJoin(authorities, eq(articles.authorityId, authorities.id))
      .where(and(...conditions))
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Fetch all articles regardless of status (useful for admin)
   */
  static async getArticles(params: { limit?: number; offset?: number; search?: string; type?: string } = {}) {
    const { limit = 50, offset = 0, search, type } = params;
    const conditions = [];
    
    if (search) conditions.push(ilike(articles.title, `%${search}%`));
    if (type && type !== "All Types") conditions.push(eq(articles.type, type as any));

    return await db
      .select({
        article: articles,
        authority: authorities,
      })
      .from(articles)
      .leftJoin(authorities, eq(articles.authorityId, authorities.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);
  }

  /**
   * Get a single article by slug
   */
  static async getArticleBySlug(slug: string) {
    const result = await db
      .select({
        article: articles,
        authority: authorities,
      })
      .from(articles)
      .leftJoin(authorities, eq(articles.authorityId, authorities.id))
      .where(eq(articles.slug, slug))
      .limit(1);

    return result[0] ?? null;
  }

  /**
   * Create a new article
   */
  static async createArticle(data: ArticleInsert) {
    const validated = ArticleCreateSchema.parse(data);
    const [newArticle] = await db
      .insert(articles)
      .values({ ...validated, publishedAt: validated.status === "Published" ? new Date() : null })
      .returning();
    return newArticle;
  }
  /**
   * Get a single article by ID
   */
  static async getArticleById(id: string) {
    const result = await db
      .select({
        article: articles,
        authority: authorities,
      })
      .from(articles)
      .leftJoin(authorities, eq(articles.authorityId, authorities.id))
      .where(eq(articles.id, id))
      .limit(1);

    return result[0] ?? null;
  }

  /**
   * Update an existing article
   */
  static async updateArticle(id: string, data: Partial<ArticleInsert>) {
    const updateData: any = { ...data };
    
    // Automatically manage publishedAt if status changes
    if (data.status === "Published") {
      updateData.publishedAt = new Date();
    } else if (data.status) {
      updateData.publishedAt = null;
    }
    
    updateData.updatedAt = new Date();

    const [updatedArticle] = await db
      .update(articles)
      .set(updateData)
      .where(eq(articles.id, id))
      .returning();
      
    return updatedArticle;
  }

  /**
   * Delete an article
   */
  static async deleteArticle(id: string) {
    const [deletedArticle] = await db
      .delete(articles)
      .where(eq(articles.id, id))
      .returning();
    return deletedArticle;
  }
}
