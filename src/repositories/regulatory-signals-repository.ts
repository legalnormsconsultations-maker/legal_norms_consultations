import { db } from "@/db";
import { regulatorySignals } from "@/db/schema";
import { eq } from "drizzle-orm";

export class RegulatorySignalsRepository {
  /**
   * Fetches a regulatory signal by its reference ID or primary key ID
   */
  static async getSignalById(id: string) {
    const result = await db
      .select()
      .from(regulatorySignals)
      .where(
        // we can query by primary key uuid or the reference id
        // here we'll just check if it matches the reference ID first
        eq(regulatorySignals.referenceId, id)
      )
      .limit(1);
    
    return result[0] || null;
  }

  /**
   * Create or update a regulatory signal
   */
  static async upsertSignal(data: typeof regulatorySignals.$inferInsert) {
    const existing = await this.getSignalById(data.referenceId);
    if (existing) {
      const result = await db
        .update(regulatorySignals)
        .set(data)
        .where(eq(regulatorySignals.id, existing.id))
        .returning();
      return result[0];
    } else {
      const result = await db
        .insert(regulatorySignals)
        .values(data)
        .returning();
      return result[0];
    }
  }
}
