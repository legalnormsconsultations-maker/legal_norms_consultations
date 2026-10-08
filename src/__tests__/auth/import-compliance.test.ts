import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  buildImportComplianceTasks,
  type CreateImportComplianceCase,
} from "@/services/import-compliance.service";

const baseCase: CreateImportComplianceCase = {
  productName: "Example medicine",
  applicantName: "Example importer",
  countryOfOrigin: "Germany",
  productType: "DRUG",
  isScheduleX: false,
  isNewDrug: false,
  isFixedDoseCombination: false,
  isClinicalTrialImport: false,
  isForTesting: false,
  hasWholesaleLicense: true,
  hasAuthorizedAgent: true,
  hasImportExportCode: true,
  importLicenseExpiresAt: null,
};

describe("India import compliance checklist generation", () => {
  it("includes baseline authorization, importer-readiness, and post-market tasks", () => {
    const tasks = buildImportComplianceTasks(baseCase);
    const keys = tasks.map((task) => task.key);

    expect(keys).toContain("registration_certificate");
    expect(keys).toContain("import_license");
    expect(keys).toContain("post_approval_changes");
    expect(keys).toContain("safety_recall");
    expect(
      tasks.find((task) => task.key === "import_license")?.formHint,
    ).toContain("Form 10");
  });

  it("adds special-pathway checks and missing importer prerequisites", () => {
    const tasks = buildImportComplianceTasks({
      ...baseCase,
      productType: "BIOLOGICAL",
      isNewDrug: true,
      isFixedDoseCombination: true,
      isClinicalTrialImport: true,
      hasWholesaleLicense: false,
      hasAuthorizedAgent: false,
      hasImportExportCode: false,
    });
    const keys = tasks.map((task) => task.key);

    expect(keys).toContain("biological_registration");
    expect(keys).toContain("biological_lot_release");
    expect(keys).toContain("new_drug_permission");
    expect(keys).toContain("test_clinical_permission");
    expect(keys).toContain("obtain_wholesale_license");
    expect(keys).toContain("appoint_agent");
    expect(keys).toContain("obtain_iec");
  });

  it("generates distinct tasks for non-drug regulatory sectors", () => {
    const pathwayKeys = [
      ["MEDICAL_DEVICE", "device_classification"],
      ["IVD", "ivd_performance"],
      ["COSMETIC", "cosmetic_import_registration"],
      ["FOOD_NUTRACEUTICAL", "fssai_import"],
      ["LEGAL_METROLOGY", "metrology_declarations"],
      ["EPR", "epr_registration"],
      ["NARCOTIC", "controlled_custody"],
      ["WIRELESS", "wireless_evidence"],
      ["BIS", "bis_conformity"],
      ["VETERINARY", "veterinary_pathway"],
      ["AYUSH", "ayush_classification"],
      ["OTHER", "other_authority_route"],
    ] as const;

    for (const [productType, expectedTask] of pathwayKeys) {
      const tasks = buildImportComplianceTasks({
        ...baseCase,
        productType,
      });
      expect(tasks.map((task) => task.key)).toContain(expectedTask);
    }
  });

  it("adds fixed-dose-combination evidence only for drug cases", () => {
    const tasks = buildImportComplianceTasks({
      ...baseCase,
      isFixedDoseCombination: true,
    });
    expect(tasks.map((task) => task.key)).toContain("combination_evidence");
  });
});
