import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { drugs } from "@/db/schema";

export type Drug = InferSelectModel<typeof drugs>;
export type NewDrug = InferInsertModel<typeof drugs>;

/**
 * Data Access Layer: Drugs
 *
 * This repository is strictly responsible for direct database interactions
 * using Drizzle ORM. It contains ZERO business logic.
 */
async function findById(id: string): Promise<Drug | undefined> {
  const result = await db.select().from(drugs).where(eq(drugs.id, id)).limit(1);
  return result[0];
}

async function findAll(
  limit: number = 50,
  offset: number = 0,
): Promise<Drug[]> {
  return await db.select().from(drugs).limit(limit).offset(offset);
}

async function create(data: NewDrug, requestId?: string): Promise<Drug> {
  void requestId;

  const result = await db.insert(drugs).values(data).returning();
  return result[0];
}

export const DrugsRepository = {
  findById,
  findAll,
  create,
};
