import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs, portfolioItems } from "@/db/schema";

export type NewPortfolioItem = {
  productName: string;
  category: string | null;
  phase: string | null;
  description: string | null;
  drugId?: string | null;
};

export const PortfolioRepository = {
  async listByOwner(ownerId: string) {
    return db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.ownerId, ownerId))
      .orderBy(portfolioItems.createdAt);
  },

  async create(input: {
    ownerId: string;
    organizationId: string | null;
    requestId: string;
    data: NewPortfolioItem;
  }) {
    return db.transaction(async (transaction) => {
      const [item] = await transaction
        .insert(portfolioItems)
        .values({ ...input.data, ownerId: input.ownerId })
        .returning();
      await transaction.insert(auditLogs).values({
        userId: input.ownerId,
        organizationId: input.organizationId,
        action: "portfolio_item.created",
        resourceType: "portfolio_item",
        resourceId: item.id,
        requestId: input.requestId,
        afterState: item,
      });
      return item;
    });
  },

  async remove(input: {
    ownerId: string;
    organizationId: string | null;
    requestId: string;
    itemId: string;
  }) {
    return db.transaction(async (transaction) => {
      const [existing] = await transaction
        .select()
        .from(portfolioItems)
        .where(
          and(
            eq(portfolioItems.id, input.itemId),
            eq(portfolioItems.ownerId, input.ownerId),
          ),
        )
        .limit(1);
      if (!existing) return false;

      await transaction
        .delete(portfolioItems)
        .where(
          and(
            eq(portfolioItems.id, input.itemId),
            eq(portfolioItems.ownerId, input.ownerId),
          ),
        );
      await transaction.insert(auditLogs).values({
        userId: input.ownerId,
        organizationId: input.organizationId,
        action: "portfolio_item.deleted",
        resourceType: "portfolio_item",
        resourceId: existing.id,
        requestId: input.requestId,
        beforeState: existing,
      });
      return true;
    });
  },

  async update(input: {
    ownerId: string;
    organizationId: string | null;
    requestId: string;
    itemId: string;
    data: Partial<NewPortfolioItem>;
  }) {
    return db.transaction(async (transaction) => {
      const [existing] = await transaction
        .select()
        .from(portfolioItems)
        .where(
          and(
            eq(portfolioItems.id, input.itemId),
            eq(portfolioItems.ownerId, input.ownerId),
          ),
        )
        .limit(1);

      if (!existing) throw new Error("Portfolio item not found");

      const [updated] = await transaction
        .update(portfolioItems)
        .set(input.data)
        .where(eq(portfolioItems.id, existing.id))
        .returning();

      await transaction.insert(auditLogs).values({
        userId: input.ownerId,
        organizationId: input.organizationId,
        action: "portfolio_item.updated",
        resourceType: "portfolio_item",
        resourceId: updated.id,
        requestId: input.requestId,
        beforeState: existing,
        afterState: updated,
      });

      return updated;
    });
  },
};
