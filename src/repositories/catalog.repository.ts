import { and, asc, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/db";
import {
  drugs,
  manufacturers,
  portfolioDocuments,
  portfolioItems,
  regulatoryAuthorities,
  regulatoryDocuments,
  regulatoryEvents,
  researchArticles,
  safetyUpdates,
} from "@/db/schema";

const PAGE_SIZE = 25;

function searchPattern(query: string) {
  return `%${query.replace(/[%_\\]/g, "\\$&")}%`;
}

function pageOffset(page: number) {
  return (page - 1) * PAGE_SIZE;
}

function drugSearch(query: string): SQL | undefined {
  const term = query.trim();
  if (!term) return undefined;
  const pattern = searchPattern(term);
  return or(
    ilike(drugs.drugName, pattern),
    ilike(drugs.genericName, pattern),
    ilike(drugs.brandName, pattern),
    ilike(drugs.manufacturer, pattern),
  );
}

function manufacturerSearch(query: string): SQL | undefined {
  const term = query.trim();
  if (!term) return undefined;
  const pattern = searchPattern(term);
  return or(
    ilike(manufacturers.name, pattern),
    ilike(manufacturers.country, pattern),
    ilike(manufacturers.headquarters, pattern),
  );
}

export const CatalogRepository = {
  async listDrugs(query: string, page: number) {
    const where = drugSearch(query);
    const items = await db
      .select()
      .from(drugs)
      .where(where)
      .orderBy(asc(drugs.drugName))
      .limit(PAGE_SIZE)
      .offset(pageOffset(page));
    const total = await db.$count(drugs, where);
    return { items, total, page, pageSize: PAGE_SIZE };
  },

  async listManufacturers(query: string, page: number) {
    const where = manufacturerSearch(query);
    const items = await db
      .select()
      .from(manufacturers)
      .where(where)
      .orderBy(asc(manufacturers.name))
      .limit(PAGE_SIZE)
      .offset(pageOffset(page));
    const total = await db.$count(manufacturers, where);
    return { items, total, page, pageSize: PAGE_SIZE };
  },

  async listPublicDocuments(query: string, page: number) {
    const term = query.trim();
    const where = term
      ? and(
          eq(regulatoryDocuments.accessLevel, "public"),
          or(
            ilike(regulatoryDocuments.title, searchPattern(term)),
            ilike(regulatoryDocuments.documentType, searchPattern(term)),
          ),
        )
      : eq(regulatoryDocuments.accessLevel, "public");
    const items = await db
      .select({
        id: regulatoryDocuments.id,
        title: regulatoryDocuments.title,
        documentType: regulatoryDocuments.documentType,
        mimeType: regulatoryDocuments.mimeType,
        sizeBytes: regulatoryDocuments.sizeBytes,
        publishedDate: regulatoryDocuments.publishedDate,
        createdAt: regulatoryDocuments.createdAt,
        drugId: regulatoryDocuments.drugId,
        accessLevel: regulatoryDocuments.accessLevel,
      })
      .from(regulatoryDocuments)
      .where(where)
      .orderBy(
        desc(regulatoryDocuments.publishedDate),
        desc(regulatoryDocuments.createdAt),
      )
      .limit(PAGE_SIZE)
      .offset(pageOffset(page));
    const total = await db.$count(regulatoryDocuments, where);
    return { items, total, page, pageSize: PAGE_SIZE };
  },

  async listPortfolioDocuments(userId: string, query: string, page: number) {
    const term = query.trim();
    const where = term
      ? and(
          eq(portfolioDocuments.ownerId, userId),
          ilike(portfolioDocuments.title, searchPattern(term)),
        )
      : eq(portfolioDocuments.ownerId, userId);
    const items = await db
      .select({
        id: portfolioDocuments.id,
        title: portfolioDocuments.title,
        documentType: portfolioDocuments.documentType,
        mimeType: portfolioDocuments.mimeType,
        sizeBytes: portfolioDocuments.sizeBytes,
        accessLevel: portfolioDocuments.accessLevel,
        createdAt: portfolioDocuments.createdAt,
      })
      .from(portfolioDocuments)
      .where(where)
      .orderBy(desc(portfolioDocuments.createdAt))
      .limit(PAGE_SIZE)
      .offset(pageOffset(page));
    const total = await db.$count(portfolioDocuments, where);
    return { items, total, page, pageSize: PAGE_SIZE };
  },

  async findPublicRegulatoryDocument(id: string) {
    const [document] = await db
      .select()
      .from(regulatoryDocuments)
      .where(
        and(
          eq(regulatoryDocuments.id, id),
          eq(regulatoryDocuments.accessLevel, "public"),
        ),
      )
      .limit(1);
    return document;
  },

  async findOwnedPortfolioDocument(id: string, userId: string) {
    const [document] = await db
      .select()
      .from(portfolioDocuments)
      .where(
        and(
          eq(portfolioDocuments.id, id),
          eq(portfolioDocuments.ownerId, userId),
        ),
      )
      .limit(1);
    return document;
  },

  async listPortfolioItems(userId: string) {
    return db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.ownerId, userId))
      .orderBy(desc(portfolioItems.updatedAt));
  },

  async listRegulatoryEvents(page: number) {
    return db
      .select({
        id: regulatoryEvents.id,
        title: regulatoryEvents.eventTitle,
        eventType: regulatoryEvents.eventType,
        phase: regulatoryEvents.milestonePhase,
        occurredAt: regulatoryEvents.eventTimestamp,
        sourceName: regulatoryEvents.sourceName,
        sourceUrl: regulatoryEvents.sourceUrl,
        drugId: regulatoryEvents.drugId,
        drugName: drugs.drugName,
        authority: regulatoryAuthorities.acronym,
      })
      .from(regulatoryEvents)
      .leftJoin(drugs, eq(regulatoryEvents.drugId, drugs.id))
      .leftJoin(
        regulatoryAuthorities,
        eq(regulatoryEvents.authorityId, regulatoryAuthorities.id),
      )
      .orderBy(desc(regulatoryEvents.eventTimestamp))
      .limit(PAGE_SIZE)
      .offset(pageOffset(page));
  },

  async listSafetyUpdates(page: number) {
    return db
      .select({
        id: safetyUpdates.id,
        title: safetyUpdates.title,
        severity: safetyUpdates.severity,
        description: safetyUpdates.description,
        issuedDate: safetyUpdates.issuedDate,
        drugId: safetyUpdates.drugId,
        drugName: drugs.drugName,
        authority: regulatoryAuthorities.acronym,
      })
      .from(safetyUpdates)
      .leftJoin(drugs, eq(safetyUpdates.drugId, drugs.id))
      .leftJoin(
        regulatoryAuthorities,
        eq(safetyUpdates.authorityId, regulatoryAuthorities.id),
      )
      .orderBy(desc(safetyUpdates.issuedDate))
      .limit(PAGE_SIZE)
      .offset(pageOffset(page));
  },

  async getSafetyUpdateDetail(id: string) {
    const [update] = await db
      .select({
        id: safetyUpdates.id,
        title: safetyUpdates.title,
        severity: safetyUpdates.severity,
        description: safetyUpdates.description,
        issuedDate: safetyUpdates.issuedDate,
        createdAt: safetyUpdates.createdAt,
        drugId: safetyUpdates.drugId,
        drugName: drugs.drugName,
        authorityId: safetyUpdates.authorityId,
        authorityName: regulatoryAuthorities.name,
        authorityAcronym: regulatoryAuthorities.acronym,
      })
      .from(safetyUpdates)
      .leftJoin(drugs, eq(safetyUpdates.drugId, drugs.id))
      .leftJoin(
        regulatoryAuthorities,
        eq(safetyUpdates.authorityId, regulatoryAuthorities.id),
      )
      .where(eq(safetyUpdates.id, id))
      .limit(1);
    return update || null;
  },

  async listResearch(query: string, page: number) {
    const term = query.trim();
    const where = term
      ? or(
          ilike(researchArticles.title, searchPattern(term)),
          ilike(researchArticles.abstract, searchPattern(term)),
          ilike(researchArticles.publisher, searchPattern(term)),
        )
      : undefined;
    const items = await db
      .select()
      .from(researchArticles)
      .where(where)
      .orderBy(desc(researchArticles.publicationDate))
      .limit(PAGE_SIZE)
      .offset(pageOffset(page));
    const total = await db.$count(researchArticles, where);
    return { items, total, page, pageSize: PAGE_SIZE };
  },

  async getDrugDetail(id: string) {
    const [drug] = await db
      .select({
        drug: drugs,
        manufacturer: manufacturers,
      })
      .from(drugs)
      .leftJoin(manufacturers, eq(drugs.manufacturerId, manufacturers.id))
      .where(eq(drugs.id, id))
      .limit(1);

    if (!drug) return null;

    const drugDocuments = await db
      .select()
      .from(regulatoryDocuments)
      .where(eq(regulatoryDocuments.drugId, id));

    const events = await db
      .select({
        id: regulatoryEvents.id,
        title: regulatoryEvents.eventTitle,
        eventType: regulatoryEvents.eventType,
        phase: regulatoryEvents.milestonePhase,
        occurredAt: regulatoryEvents.eventTimestamp,
        sourceName: regulatoryEvents.sourceName,
        sourceUrl: regulatoryEvents.sourceUrl,
        authority: regulatoryAuthorities.acronym,
      })
      .from(regulatoryEvents)
      .leftJoin(
        regulatoryAuthorities,
        eq(regulatoryEvents.authorityId, regulatoryAuthorities.id),
      )
      .where(eq(regulatoryEvents.drugId, id))
      .orderBy(desc(regulatoryEvents.eventTimestamp));

    const warnings = await db
      .select()
      .from(safetyUpdates)
      .where(eq(safetyUpdates.drugId, id));

    return {
      ...drug.drug,
      manufacturerData: drug.manufacturer,
      documents: drugDocuments,
      regulatoryEvents: events,
      safetyUpdates: warnings,
    };
  },

  async getManufacturerDetail(id: string) {
    const [manufacturer] = await db
      .select()
      .from(manufacturers)
      .where(eq(manufacturers.id, id))
      .limit(1);
    if (!manufacturer) return null;
    const mfgDrugs = await db
      .select()
      .from(drugs)
      .where(eq(drugs.manufacturerId, id));
    return { ...manufacturer, drugs: mfgDrugs };
  },

  async getRegulatoryEventDetail(id: string) {
    const [event] = await db
      .select({
        id: regulatoryEvents.id,
        eventType: regulatoryEvents.eventType,
        eventTitle: regulatoryEvents.eventTitle,
        eventTimestamp: regulatoryEvents.eventTimestamp,
        milestonePhase: regulatoryEvents.milestonePhase,
        sourceUrl: regulatoryEvents.sourceUrl,
        sourceName: regulatoryEvents.sourceName,
        createdAt: regulatoryEvents.createdAt,
        authorityId: regulatoryEvents.authorityId,
        authorityName: regulatoryAuthorities.name,
        authorityAcronym: regulatoryAuthorities.acronym,
      })
      .from(regulatoryEvents)
      .leftJoin(
        regulatoryAuthorities,
        eq(regulatoryEvents.authorityId, regulatoryAuthorities.id),
      )
      .where(eq(regulatoryEvents.id, id))
      .limit(1);
    return event || null;
  },

  async getResearchArticleDetail(id: string) {
    const [article] = await db
      .select()
      .from(researchArticles)
      .where(eq(researchArticles.id, id))
      .limit(1);
    return article || null;
  },
};
