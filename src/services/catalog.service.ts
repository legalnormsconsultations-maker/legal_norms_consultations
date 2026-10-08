import { z } from "zod";
import type { CurrentUser } from "@/lib/auth/session";
import { CatalogRepository } from "@/repositories/catalog.repository";

const pageSchema = z.coerce.number().int().min(1).max(1000).default(1);
const querySchema = z.string().trim().max(120).default("");

function parsePage(value?: string) {
  return pageSchema.parse(value ?? "1");
}

function parseQuery(value?: string) {
  return querySchema.parse(value ?? "");
}

export const CatalogService = {
  async listDrugs(params: { q?: string; page?: string }) {
    return CatalogRepository.listDrugs(
      parseQuery(params.q),
      parsePage(params.page),
    );
  },

  async listManufacturers(params: { q?: string; page?: string }) {
    return CatalogRepository.listManufacturers(
      parseQuery(params.q),
      parsePage(params.page),
    );
  },

  async listDocuments(
    user: CurrentUser,
    params: { q?: string; page?: string },
  ) {
    const query = parseQuery(params.q);
    const page = parsePage(params.page);
    const [publicDocuments, portfolioDocuments] = await Promise.all([
      CatalogRepository.listPublicDocuments(query, page),
      CatalogRepository.listPortfolioDocuments(user.id, query, page),
    ]);
    return { publicDocuments, portfolioDocuments };
  },

  async listRegulatoryActivity(page?: string) {
    const parsedPage = parsePage(page);
    const [events, safetyUpdates] = await Promise.all([
      CatalogRepository.listRegulatoryEvents(parsedPage),
      CatalogRepository.listSafetyUpdates(parsedPage),
    ]);
    return {
      events: events.map((event) => ({
        ...event,
        recordType: "event" as const,
      })),
      safetyUpdates: safetyUpdates.map((update) => ({
        ...update,
        recordType: "safety" as const,
      })),
    };
  },

  async listResearch(params: { q?: string; page?: string }) {
    return CatalogRepository.listResearch(
      parseQuery(params.q),
      parsePage(params.page),
    );
  },

  async listPortfolio(user: CurrentUser) {
    return CatalogRepository.listPortfolioItems(user.id);
  },

  async getDrugDetail(id: string) {
    return CatalogRepository.getDrugDetail(id);
  },

  async getManufacturerDetail(id: string) {
    return CatalogRepository.getManufacturerDetail(id);
  },

  async getRegulatoryEventDetail(id: string) {
    return CatalogRepository.getRegulatoryEventDetail(id);
  },

  async getSafetyUpdateDetail(id: string) {
    return CatalogRepository.getSafetyUpdateDetail(id);
  },

  async getResearchArticleDetail(id: string) {
    return CatalogRepository.getResearchArticleDetail(id);
  },
};
