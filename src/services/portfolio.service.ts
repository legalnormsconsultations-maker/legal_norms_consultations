import { z } from "zod";
import type { CurrentUser } from "@/lib/auth/session";
import { PortfolioRepository } from "@/repositories/portfolio.repository";

const portfolioItemSchema = z.object({
  productName: z.string().trim().min(2).max(255),
  category: z.string().trim().max(100).optional().nullable(),
  phase: z.string().trim().max(100).optional().nullable(),
  description: z.string().trim().max(2000).optional().nullable(),
  drugId: z.string().uuid().optional().nullable(),
});

export const PortfolioService = {
  async create(user: CurrentUser, requestId: string, input: unknown) {
    const parsed = portfolioItemSchema.parse(input);
    return PortfolioRepository.create({
      ownerId: user.id,
      organizationId: user.organizationId,
      requestId,
      data: {
        productName: parsed.productName,
        category: parsed.category || null,
        phase: parsed.phase || null,
        description: parsed.description || null,
        drugId: parsed.drugId || null,
      },
    });
  },

  async update(
    user: CurrentUser,
    requestId: string,
    itemId: string,
    input: unknown,
  ) {
    const parsed = portfolioItemSchema.partial().parse(input);
    return PortfolioRepository.update({
      ownerId: user.id,
      organizationId: user.organizationId,
      requestId,
      itemId,
      data: parsed,
    });
  },

  async remove(user: CurrentUser, requestId: string, itemId: string) {
    const id = z.uuid().parse(itemId);
    const removed = await PortfolioRepository.remove({
      ownerId: user.id,
      organizationId: user.organizationId,
      requestId,
      itemId: id,
    });
    if (!removed) throw new Error("Portfolio item not found.");
  },
};
