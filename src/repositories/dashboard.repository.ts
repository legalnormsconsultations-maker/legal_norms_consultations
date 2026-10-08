import { count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  drugs,
  portfolioItems,
  regulatoryAuthorities,
  regulatoryDocuments,
  regulatoryEvents,
  safetyUpdates,
} from "@/db/schema";

export const DashboardRepository = {
  async getMetrics() {
    const [drugsCount] = await db.select({ value: count() }).from(drugs);
    const [alertsCount] = await db
      .select({ value: count() })
      .from(safetyUpdates);
    const [docsCount] = await db
      .select({ value: count() })
      .from(regulatoryDocuments);

    return {
      monitoredDrugs: drugsCount.value,
      activeAlerts: alertsCount.value,
      documentsScanned: docsCount.value,
      portfolioViews: 89, // Stubbed until analytics feature is implemented
    };
  },

  async getRecentEvents(limit: number = 5) {
    return db
      .select({
        id: regulatoryEvents.id,
        drugName: drugs.drugName,
        authority: regulatoryAuthorities.acronym,
        event: regulatoryEvents.eventTitle,
        date: regulatoryEvents.eventTimestamp,
        type: regulatoryEvents.eventType,
      })
      .from(regulatoryEvents)
      .leftJoin(drugs, eq(regulatoryEvents.drugId, drugs.id))
      .leftJoin(
        regulatoryAuthorities,
        eq(regulatoryEvents.authorityId, regulatoryAuthorities.id),
      )
      .orderBy(desc(regulatoryEvents.eventTimestamp))
      .limit(limit);
  },
};
