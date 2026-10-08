import { ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { drugs, manufacturers, regulatoryDocuments } from "@/db/schema";

export type SearchResultItem = {
  id: string;
  type: "DRUG" | "MANUFACTURER" | "DOCUMENT";
  title: string;
  subtitle?: string;
  url: string;
};

export const SearchService = {
  /**
   * Performs a global search across multiple entities.
   */
  async globalSearch(
    query: string,
    filters?: { type?: string; limit?: number; offset?: number }
  ): Promise<{ results: SearchResultItem[]; total: number }> {
    if (!query || query.length < 2) return { results: [], total: 0 };

    const wildcardQuery = `%${query}%`;
    const limit = filters?.limit || 10;
    const offset = filters?.offset || 0;
    const typeFilter = filters?.type || "all";

    let drugsResult: any[] = [];
    let manufacturersResult: any[] = [];
    let docsResult: any[] = [];

    // Depending on the type filter, query relevant tables
    const fetchDrugs = typeFilter === "all" || typeFilter === "drug";
    const fetchManufacturers = typeFilter === "all" || typeFilter === "manufacturer";
    const fetchDocs = typeFilter === "all" || typeFilter === "document";

    const promises = [];

    if (fetchDrugs) {
      promises.push(
        db
          .select({
            id: drugs.id,
            drugName: drugs.drugName,
            genericName: drugs.genericName,
          })
          .from(drugs)
          .where(
            or(
              ilike(drugs.drugName, wildcardQuery),
              ilike(drugs.genericName, wildcardQuery),
            )
          )
          .limit(limit)
          .then((res) => {
            drugsResult = res;
          })
      );
    }

    if (fetchManufacturers) {
      promises.push(
        db
          .select({
            id: manufacturers.id,
            name: manufacturers.name,
            country: manufacturers.country,
          })
          .from(manufacturers)
          .where(ilike(manufacturers.name, wildcardQuery))
          .limit(limit)
          .then((res) => {
            manufacturersResult = res;
          })
      );
    }

    if (fetchDocs) {
      promises.push(
        db
          .select({
            id: regulatoryDocuments.id,
            title: regulatoryDocuments.title,
            docType: regulatoryDocuments.documentType,
          })
          .from(regulatoryDocuments)
          .where(ilike(regulatoryDocuments.title, wildcardQuery))
          .limit(limit)
          .then((res) => {
            docsResult = res;
          })
      );
    }

    await Promise.all(promises);

    // Map and combine results
    let results: SearchResultItem[] = [
      ...drugsResult.map((d) => ({
        id: d.id,
        type: "DRUG" as const,
        title: d.drugName,
        subtitle: d.genericName || "Drug",
        url: `/admin/drugs/${d.id}`,
      })),
      ...manufacturersResult.map((m) => ({
        id: m.id,
        type: "MANUFACTURER" as const,
        title: m.name,
        subtitle: m.country || "Manufacturer",
        url: `/admin/manufacturers/${m.id}`,
      })),
      ...docsResult.map((doc) => ({
        id: doc.id,
        type: "DOCUMENT" as const,
        title: doc.title,
        subtitle: doc.docType || "Document",
        url: `/admin/documents/${doc.id}`,
      })),
    ];

    // Simple sorting and pagination on combined results
    results = results.slice(offset, offset + limit);
    
    // In a real robust implementation, total would be a COUNT() query.
    // We approximate it here for the UI based on how many fetched.
    const total = drugsResult.length + manufacturersResult.length + docsResult.length;

    return {
      results,
      total: offset + total // estimate for pagination
    };
  },
};
