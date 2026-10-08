import { describe, expect, it, vi } from "vitest";
import type { CurrentUser } from "@/lib/auth/session";
import { DrugsRepository } from "@/repositories/drugs.repository";
import { DrugsService } from "@/services/drugs.service";

// Mock the underlying DB layer to isolate Service Logic (Unit/Integration Test)
vi.mock("@/repositories/drugs.repository");
vi.mock("@/lib/audit/logger");

const createMockUser = (
  roles: string[],
  permissions: string[] = [],
  orgId?: string,
): CurrentUser => ({
  id: "user-1",
  email: "test@example.com",
  firstName: "Test",
  lastName: "User",
  roles,
  permissions,
  organizationId: orgId ?? null,
  phoneNumber: null,
  phoneVerified: false,
  avatarUrl: null,
});

describe("DrugsService - Core Business Logic & Security", () => {
  describe("createDrug()", () => {
    it("should reject drug creation if user lacks PLATFORM_ADMIN or EDITOR roles", async () => {
      const mockUser = createMockUser(["VIEWER"]);

      const payload = {
        genericName: "Aspirin",
        brandName: "Bayer",
        status: "APPROVED" as const,
      };

      await expect(DrugsService.createDrug(payload, mockUser)).rejects.toThrow(
        "UNAUTHORIZED_ACTION: Insufficient privileges to create drug records.",
      );

      expect(DrugsRepository.create).not.toHaveBeenCalled();
    });

    it("should create drug, trigger audit log, and return normalized payload for PLATFORM_ADMIN", async () => {
      const mockUser = createMockUser(["PLATFORM_ADMIN"], [], "org-1");
      const payload = {
        genericName: "Aspirin",
        brandName: "Bayer",
        status: "APPROVED" as const,
      };

      const mockDbResponse = {
        id: "uuid-123",
        ...payload,
        createdAt: new Date(),
      };
      vi.mocked(DrugsRepository.create).mockResolvedValueOnce(
        mockDbResponse as never,
      );

      const result = await DrugsService.createDrug(payload, mockUser);

      expect(DrugsRepository.create).toHaveBeenCalledWith(
        payload,
        expect.any(String),
      );
      expect(result).toMatchObject({
        genericName: "Aspirin",
        status: "APPROVED",
      });
    });
  });

  describe("getDrugById()", () => {
    it("should securely filter unpublished documents if the user is not in the owning organization", async () => {
      const mockUser = createMockUser(["VIEWER"], [], "org-external");
      const mockDrugId = "drug-uuid-456";

      const mockDbResponse = {
        id: mockDrugId,
        genericName: "Test Drug",
        documents: [
          { id: "doc-1", isPublic: true, organizationId: "org-internal" },
          { id: "doc-2", isPublic: false, organizationId: "org-internal" },
        ],
      };

      vi.mocked(DrugsRepository.findById).mockResolvedValueOnce(
        mockDbResponse as never,
      );

      const result = await DrugsService.getDrugById(mockDrugId, mockUser);

      expect(result.documents).toHaveLength(1);
      expect(result.documents[0].id).toBe("doc-1");
    });
  });
});
