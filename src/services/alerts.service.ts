import { eq } from "drizzle-orm";
import { db } from "@/db";
import { regulatoryEvents, safetyUpdates } from "@/db/schema";

export const AlertsService = {
  // Regulatory Events
  async createEvent(data: {
    eventType: string;
    eventTitle: string;
    eventTimestamp: Date;
    milestonePhase?: string;
    sourceUrl?: string;
    sourceName?: string;
  }) {
    const [created] = await db
      .insert(regulatoryEvents)
      .values(data)
      .returning();
    return created;
  },

  async updateEvent(
    id: string,
    data: {
      eventType?: string;
      eventTitle?: string;
      eventTimestamp?: Date;
      milestonePhase?: string;
      sourceUrl?: string;
      sourceName?: string;
    },
  ) {
    const [updated] = await db
      .update(regulatoryEvents)
      .set({ ...data, createdAt: new Date() }) // using createdAt as updatedAt since it doesn't have one
      .where(eq(regulatoryEvents.id, id))
      .returning();
    if (!updated) throw new Error("Event not found");
    return updated;
  },

  async removeEvent(id: string) {
    const [deleted] = await db
      .delete(regulatoryEvents)
      .where(eq(regulatoryEvents.id, id))
      .returning({ id: regulatoryEvents.id });
    if (!deleted) throw new Error("Event not found");
  },

  // Safety Updates
  async createSafetyUpdate(data: {
    title: string;
    severity: string;
    description: string;
    issuedDate: Date;
  }) {
    const [created] = await db.insert(safetyUpdates).values(data).returning();
    return created;
  },

  async updateSafetyUpdate(
    id: string,
    data: {
      title?: string;
      severity?: string;
      description?: string;
      issuedDate?: Date;
    },
  ) {
    const [updated] = await db
      .update(safetyUpdates)
      .set({ ...data, createdAt: new Date() }) // using createdAt as updatedAt since it doesn't have one
      .where(eq(safetyUpdates.id, id))
      .returning();
    if (!updated) throw new Error("Safety update not found");
    return updated;
  },

  async removeSafetyUpdate(id: string) {
    const [deleted] = await db
      .delete(safetyUpdates)
      .where(eq(safetyUpdates.id, id))
      .returning({ id: safetyUpdates.id });
    if (!deleted) throw new Error("Safety update not found");
  },
};
