import { logAuditEvent } from "@/lib/audit/logger";
import { hasPermission, PERMISSIONS } from "@/lib/auth/rbac";
import type { CurrentUser } from "@/lib/auth/session";
import {
  type Drug,
  DrugsRepository,
  type NewDrug,
} from "@/repositories/drugs.repository";

type DrugCreateInput = {
  genericName: string;
  brandName?: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
};

/**
 * Service Layer: Drugs
 *
 * This service handles all business logic, validation coordination, and orchestrates
 * calls to the Data Access Layer (Repositories).
 */
export const DrugsService = {
  async getDrugDetails(id: string): Promise<Drug> {
    if (!id) throw new Error("Drug ID is required for lookup.");

    const drug = await DrugsRepository.findById(id);

    if (!drug) {
      throw new Error(
        `Drug with ID ${id} was not found in the global registry.`,
      );
    }

    return drug;
  },

  async registerNewDrug(data: NewDrug): Promise<Drug> {
    if (!data.drugName) {
      throw new Error("A primary drug name is strictly required.");
    }

    return await DrugsRepository.create(data);
  },

  async createDrug(payload: DrugCreateInput, user: CurrentUser): Promise<Drug> {
    if (
      !hasPermission(user, PERMISSIONS.MANAGE_DRUGS) &&
      !user.roles.includes("EDITOR")
    ) {
      throw new Error(
        "UNAUTHORIZED_ACTION: Insufficient privileges to create drug records.",
      );
    }

    const requestId = `req-${user.id}-${Date.now()}`;
    const newDrug = await DrugsRepository.create(payload as NewDrug, requestId);

    await logAuditEvent(
      {
        action: "CREATE",
        resourceType: "drugs",
        resourceId: newDrug.id,
        afterState: newDrug,
      },
      { user, requestId },
    );

    return newDrug;
  },

  async getDrugById(
    id: string,
    user: CurrentUser,
  ): Promise<
    Drug & {
      documents: Array<{
        id: string;
        isPublic?: boolean;
        organizationId?: string;
      }>;
    }
  > {
    const drug = await DrugsRepository.findById(id);

    if (!drug) {
      return { ...(drug as unknown as Drug), documents: [] } as Drug & {
        documents: Array<{
          id: string;
          isPublic?: boolean;
          organizationId?: string;
        }>;
      };
    }

    const roles = user?.roles ?? [];
    const userOrg = user?.organizationId;
    const isPlatformAdmin = roles.includes("PLATFORM_ADMIN");

    const documents = Array.isArray(drug.documents)
      ? drug.documents.filter((document) => {
          if (document?.isPublic) {
            return true;
          }

          if (isPlatformAdmin) {
            return true;
          }

          if (!userOrg) {
            return false;
          }

          return document?.organizationId === userOrg;
        })
      : [];

    return {
      ...drug,
      documents,
    } as Drug & {
      documents: Array<{
        id: string;
        isPublic?: boolean;
        organizationId?: string;
      }>;
    };
  },
};
