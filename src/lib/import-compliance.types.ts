export type ImportComplianceTaskView = {
  id: string;
  taskKey: string;
  title: string;
  category: string;
  formHint: string | null;
  guidance: string;
  isRequired: boolean;
  isComplete: boolean;
  sortOrder: number;
};

export type ImportProductType =
  | "DRUG"
  | "BIOLOGICAL"
  | "API"
  | "MEDICAL_DEVICE"
  | "IVD"
  | "COSMETIC"
  | "FOOD_NUTRACEUTICAL"
  | "LEGAL_METROLOGY"
  | "EPR"
  | "NARCOTIC"
  | "WIRELESS"
  | "BIS"
  | "VETERINARY"
  | "AYUSH"
  | "OTHER";

export const importProductTypeLabels: Record<ImportProductType, string> = {
  DRUG: "Drug / finished formulation",
  BIOLOGICAL: "Biologicals / vaccines",
  API: "Active pharmaceutical ingredient",
  MEDICAL_DEVICE: "Medical device",
  IVD: "In-vitro diagnostic",
  COSMETIC: "Cosmetic",
  FOOD_NUTRACEUTICAL: "Food / nutraceutical",
  LEGAL_METROLOGY: "Packaged commodity / legal metrology",
  EPR: "Extended producer responsibility",
  NARCOTIC: "Controlled / narcotic product",
  WIRELESS: "Wireless-enabled product",
  BIS: "BIS-regulated product",
  VETERINARY: "Veterinary product",
  AYUSH: "AYUSH product",
  OTHER: "Other regulated product",
};

export type ImportComplianceCaseView = {
  id: string;
  productName: string;
  applicantName: string;
  countryOfOrigin: string;
  productType: ImportProductType;
  isScheduleX: boolean;
  isNewDrug: boolean;
  isFixedDoseCombination: boolean;
  isClinicalTrialImport: boolean;
  isForTesting: boolean;
  hasWholesaleLicense: boolean;
  hasAuthorizedAgent: boolean;
  hasImportExportCode: boolean;
  importLicenseExpiresAt: string | null;
  status: string;
  updatedAt: string;
  tasks: ImportComplianceTaskView[];
  completedCount: number;
  requiredCount: number;
  readinessPercent: number;
};
