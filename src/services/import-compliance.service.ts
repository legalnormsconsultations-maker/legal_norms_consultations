import { and, count, desc, eq, inArray, or } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { importComplianceCases, importComplianceTasks } from "@/db/schema";
import type { CurrentUser } from "@/lib/auth/session";
import type {
  ImportComplianceCaseView,
  ImportComplianceTaskView,
} from "@/lib/import-compliance.types";

const createCaseSchema = z.object({
  productName: z.string().trim().min(2).max(255),
  applicantName: z.string().trim().min(2).max(255),
  countryOfOrigin: z.string().trim().min(2).max(100),
  productType: z.enum([
    "DRUG",
    "BIOLOGICAL",
    "API",
    "MEDICAL_DEVICE",
    "IVD",
    "COSMETIC",
    "FOOD_NUTRACEUTICAL",
    "LEGAL_METROLOGY",
    "EPR",
    "NARCOTIC",
    "WIRELESS",
    "BIS",
    "VETERINARY",
    "AYUSH",
    "OTHER",
  ]),
  isScheduleX: z.boolean(),
  isNewDrug: z.boolean(),
  isFixedDoseCombination: z.boolean(),
  isClinicalTrialImport: z.boolean(),
  isForTesting: z.boolean(),
  hasWholesaleLicense: z.boolean(),
  hasAuthorizedAgent: z.boolean(),
  hasImportExportCode: z.boolean(),
  importLicenseExpiresAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable(),
});

export type CreateImportComplianceCase = z.infer<typeof createCaseSchema>;

type ComplianceTaskTemplate = {
  key: string;
  title: string;
  category: string;
  formHint: string | null;
  guidance: string;
  isRequired: boolean;
};

const commonTaskTemplates: ComplianceTaskTemplate[] = [
  {
    key: "agent_wholesale",
    title: "Confirm local representative and applicant licenses",
    category: "Applicant readiness",
    formHint: null,
    guidance:
      "Record the local representative and verify the licenses required for this applicant, sector, and intended activity.",
    isRequired: true,
  },
  {
    key: "iec",
    title: "Confirm Importer Exporter Code (IEC)",
    category: "Applicant readiness",
    formHint: "DGFT",
    guidance:
      "Confirm the importing entity has a valid IEC and that the legal name matches the application documents.",
    isRequired: true,
  },
  {
    key: "classification",
    title: "Confirm product classification and competent authority",
    category: "Product assessment",
    formHint: null,
    guidance:
      "Identify the product's regulatory category, target activity, and current competent authority before selecting an application route.",
    isRequired: true,
  },
  {
    key: "label_storage",
    title: "Review India labeling, storage, and distribution controls",
    category: "Operational readiness",
    formHint: null,
    guidance:
      "Check proposed India labeling, storage conditions, traceability, and distribution controls against the applicable product rules.",
    isRequired: true,
  },
  {
    key: "post_approval_changes",
    title: "Assign ownership for amendments, renewals, and ongoing obligations",
    category: "Lifecycle management",
    formHint: null,
    guidance:
      "Record the responsible owner and a process for tracking changes, renewals, periodic reports, and regulator communications.",
    isRequired: true,
  },
  {
    key: "safety_recall",
    title: "Set up incident, reporting, and corrective-action escalation",
    category: "Lifecycle management",
    formHint: null,
    guidance:
      "Document the applicable incident-reporting route, traceability, escalation contacts, and recall or corrective-action responsibilities.",
    isRequired: true,
  },
];

export function buildImportComplianceTasks(input: CreateImportComplianceCase) {
  const tasks = [...commonTaskTemplates];

  switch (input.productType) {
    case "DRUG":
      tasks.push(
        {
          key: "registration_certificate",
          title:
            "Review drug registration certificate applicability and dossier",
          category: "Pre-market authorization",
          formHint: "Form 40 / Form 41 references; verify current route",
          guidance:
            "Check whether registration certification applies and assemble product, manufacturing-site, quality, safety, and efficacy evidence for review.",
          isRequired: true,
        },
        {
          key: "import_license",
          title: "Confirm drug import-license forms and filing sequence",
          category: "Pre-market authorization",
          formHint:
            "Form 8 / 8-A application; Form 10 / 10-A license references",
          guidance:
            "Select the applicable application and license route for the product and Schedule X status. Treat form references as prompts to verify.",
          isRequired: true,
        },
      );
      break;
    case "BIOLOGICAL":
      tasks.push(
        {
          key: "biological_registration",
          title: "Review biological-product registration and import pathway",
          category: "Pre-market authorization",
          formHint: "Verify product-specific CDSCO requirements",
          guidance:
            "Confirm biological-specific quality, cold-chain, testing, manufacturing-site, and authorization requirements for this product.",
          isRequired: true,
        },
        {
          key: "biological_lot_release",
          title: "Document testing, batch release, and cold-chain controls",
          category: "Operational readiness",
          formHint: null,
          guidance:
            "Identify required testing laboratories, batch documentation, temperature controls, and shipment excursion handling.",
          isRequired: true,
        },
      );
      break;
    case "API":
      tasks.push({
        key: "api_pathway",
        title: "Review API-specific import and registration requirements",
        category: "Pre-market authorization",
        formHint: "Verify intended-use and product-specific route",
        guidance:
          "Confirm the API's intended use, manufacturer/site evidence, applicable registration, and import permissions for its use case.",
        isRequired: true,
      });
      break;
    case "MEDICAL_DEVICE":
      tasks.push(
        {
          key: "device_classification",
          title: "Determine medical-device risk class and license route",
          category: "Pre-market authorization",
          formHint: "MD-14 / MD-15 references; verify current applicability",
          guidance:
            "Record intended use, risk class, predicate status, and the current import-license route under applicable device rules.",
          isRequired: true,
        },
        {
          key: "device_evidence",
          title: "Collect device quality-system and performance evidence",
          category: "Technical dossier",
          formHint: "QMS / ISO 13485 evidence where applicable",
          guidance:
            "Prepare device specifications, risk management, verification/validation, clinical evidence, manufacturing-site, and quality documents as applicable.",
          isRequired: true,
        },
      );
      break;
    case "IVD":
      tasks.push(
        {
          key: "ivd_classification",
          title:
            "Classify the IVD and confirm its import or registration route",
          category: "Pre-market authorization",
          formHint: "Verify current IVD classification and license forms",
          guidance:
            "Document intended purpose, analyte, user, testing setting, and applicable IVD class before assembling the submission.",
          isRequired: true,
        },
        {
          key: "ivd_performance",
          title: "Compile analytical and clinical performance evidence",
          category: "Technical dossier",
          formHint:
            "Performance evaluation or test permission where applicable",
          guidance:
            "Gather validation, performance evaluation, labeling, storage, and manufacturing-site records required for this IVD route.",
          isRequired: true,
        },
      );
      break;
    case "COSMETIC":
      tasks.push(
        {
          key: "cosmetic_category",
          title: "Review cosmetic product category and ingredient restrictions",
          category: "Product assessment",
          formHint: "Cosmetic Rules; verify current import forms",
          guidance:
            "Confirm the product is regulated as a cosmetic, review ingredients and claims, and check whether any restricted or novel ingredients need additional review.",
          isRequired: true,
        },
        {
          key: "cosmetic_import_registration",
          title: "Prepare cosmetic import registration evidence",
          category: "Pre-market authorization",
          formHint: "COS-1 / COS-2 references; verify current applicability",
          guidance:
            "Assemble manufacturer authorization, product/ingredient details, free-sale evidence, manufacturing information, and required declarations.",
          isRequired: true,
        },
        {
          key: "cosmetic_label",
          title: "Review cosmetic label and pack declarations for India",
          category: "Label and market readiness",
          formHint: "Cosmetics Rules and packaged-commodity declarations",
          guidance:
            "Review local label content, importer details, batch/expiry information, ingredients, and packaged-commodity declarations.",
          isRequired: true,
        },
      );
      break;
    case "FOOD_NUTRACEUTICAL":
      tasks.push(
        {
          key: "food_category",
          title: "Classify the food, supplement, or nutraceutical product",
          category: "Product assessment",
          formHint: "FSSAI import and product-category requirements",
          guidance:
            "Check ingredient permissions, product category, claims, and whether any non-specified ingredient or product approval is relevant.",
          isRequired: true,
        },
        {
          key: "fssai_import",
          title: "Confirm FSSAI importer licensing and import clearance steps",
          category: "Pre-market authorization",
          formHint: "Verify current FSSAI license and clearance requirements",
          guidance:
            "Confirm the importing entity's license, customs/FICS clearance documents, sampling expectations, and product-specific approvals.",
          isRequired: true,
        },
        {
          key: "food_label_claims",
          title: "Review food label, nutrition declarations, and claims",
          category: "Label and market readiness",
          formHint: "FSSAI labeling and advertising rules",
          guidance:
            "Review ingredient/allergen declarations, nutrition panel, claims, importer details, and local packaged-commodity declarations.",
          isRequired: true,
        },
      );
      break;
    case "LEGAL_METROLOGY":
      tasks.push(
        {
          key: "metrology_importer",
          title: "Check importer registration and packaged-commodity scope",
          category: "Pre-market authorization",
          formHint: "Legal Metrology Packaged Commodities Rules",
          guidance:
            "Determine which importer/packer registrations apply to the product and the entity responsible for declarations.",
          isRequired: true,
        },
        {
          key: "metrology_declarations",
          title: "Validate mandatory package declarations",
          category: "Label and market readiness",
          formHint:
            "Quantity, MRP, importer, origin, and other applicable declarations",
          guidance:
            "Review the principal display panel and required declarations against the current rules for this commodity.",
          isRequired: true,
        },
      );
      break;
    case "EPR":
      tasks.push(
        {
          key: "epr_category",
          title: "Identify the applicable EPR category and obligated entity",
          category: "Product assessment",
          formHint: "Packaging, e-waste, battery, or other applicable rules",
          guidance:
            "Map the product and packaging to current EPR rules and identify the producer, importer, or brand-owner obligations.",
          isRequired: true,
        },
        {
          key: "epr_registration",
          title: "Confirm portal registration, targets, and reporting duties",
          category: "Pre-market authorization",
          formHint: "CPCB or relevant state/sector portal; verify route",
          guidance:
            "Check registration, collection/recycling targets, certificates, annual returns, and authorized partner requirements.",
          isRequired: true,
        },
      );
      break;
    case "NARCOTIC":
      tasks.push(
        {
          key: "controlled_classification",
          title: "Confirm controlled-substance classification and authority",
          category: "Controlled products",
          formHint: "Verify CBN and other applicable permissions",
          guidance:
            "Confirm the substance, schedule, intended use, quota, and competent central/state authorities before planning shipment.",
          isRequired: true,
        },
        {
          key: "controlled_custody",
          title: "Document controlled-storage, records, and shipment controls",
          category: "Operational readiness",
          formHint: null,
          guidance:
            "Set out secure custody, reconciliation, recordkeeping, authorized access, and incident escalation requirements.",
          isRequired: true,
        },
      );
      break;
    case "WIRELESS":
      tasks.push(
        {
          key: "wireless_scope",
          title: "Check radio equipment and frequency scope",
          category: "Product assessment",
          formHint: "WPC / ETA route; verify current applicability",
          guidance:
            "Record radio modules, frequencies, transmit power, and whether equipment approvals or exemptions may apply.",
          isRequired: true,
        },
        {
          key: "wireless_evidence",
          title: "Collect RF test reports and equipment declarations",
          category: "Technical dossier",
          formHint: "Testing laboratory and current WPC evidence requirements",
          guidance:
            "Gather equipment specifications, RF reports, manufacturer declarations, and model identifiers required for review.",
          isRequired: true,
        },
      );
      break;
    case "BIS":
      tasks.push(
        {
          key: "bis_order",
          title: "Check whether the product is covered by a mandatory QCO",
          category: "Product assessment",
          formHint: "BIS standard and current Quality Control Order",
          guidance:
            "Map the product to the applicable Indian Standard and confirm whether certification or registration is mandatory.",
          isRequired: true,
        },
        {
          key: "bis_conformity",
          title: "Plan testing, factory evidence, and conformity assessment",
          category: "Technical dossier",
          formHint: "BIS certification/registration route; verify scheme",
          guidance:
            "Identify required samples, laboratory testing, factory documentation, marking, and ongoing surveillance obligations.",
          isRequired: true,
        },
      );
      break;
    case "VETERINARY":
      tasks.push(
        {
          key: "veterinary_pathway",
          title: "Confirm veterinary product classification and import route",
          category: "Pre-market authorization",
          formHint: "Verify CDSCO and other competent authority requirements",
          guidance:
            "Clarify whether the product is a veterinary drug, biological, feed, or device and map its evidence and import permissions.",
          isRequired: true,
        },
        {
          key: "veterinary_safety",
          title: "Compile species-specific safety, quality, and use evidence",
          category: "Technical dossier",
          formHint: null,
          guidance:
            "Collect product quality, target-species safety, residue or withdrawal information, labeling, and manufacturing-site evidence as applicable.",
          isRequired: true,
        },
      );
      break;
    case "AYUSH":
      tasks.push(
        {
          key: "ayush_classification",
          title: "Determine the AYUSH system and product category",
          category: "Product assessment",
          formHint: "Ministry/state AYUSH authority; verify import route",
          guidance:
            "Identify the relevant system, product type, ingredients, claims, and authority before preparing an import or market-entry file.",
          isRequired: true,
        },
        {
          key: "ayush_evidence",
          title: "Review quality, manufacturing, and labeling evidence",
          category: "Technical dossier",
          formHint: "Applicable GMP and product standards",
          guidance:
            "Collect ingredient specifications, quality controls, manufacturing credentials, safety support, and compliant labeling.",
          isRequired: true,
        },
      );
      break;
    case "OTHER":
      tasks.push({
        key: "other_authority_route",
        title: "Identify the competent authority and product-specific route",
        category: "Product assessment",
        formHint: null,
        guidance:
          "Record the product's intended use and identify the current authority, approval, testing, and labeling requirements before proceeding.",
        isRequired: true,
      });
      break;
  }

  if (
    input.isNewDrug &&
    ["DRUG", "BIOLOGICAL", "API"].includes(input.productType)
  ) {
    tasks.push({
      key: "new_drug_permission",
      title: "Assess separate new-drug permission requirements",
      category: "Special pathway",
      formHint: "Confirm current applicable permission",
      guidance:
        "Compile the new-drug assessment and determine whether a separate permission is needed before the import-license filing.",
      isRequired: true,
    });
  }

  if (input.isFixedDoseCombination && input.productType === "DRUG") {
    tasks.push({
      key: "combination_evidence",
      title: "Document fixed-dose combination justification",
      category: "Special pathway",
      formHint: null,
      guidance:
        "Prepare the rationale for the combination, component evidence, safety and efficacy support, and any additional data requested for this product.",
      isRequired: true,
    });
  }

  if (input.isClinicalTrialImport || input.isForTesting) {
    tasks.push({
      key: "test_clinical_permission",
      title: "Confirm test or clinical-trial import permission",
      category: "Special pathway",
      formHint: "Confirm current test-license form and authority route",
      guidance:
        "Document purpose, quantities, protocol or test plan, receiving site, and the specific permission required before shipment.",
      isRequired: true,
    });
  }

  if (
    !input.hasWholesaleLicense &&
    ["DRUG", "BIOLOGICAL", "API", "VETERINARY"].includes(input.productType)
  ) {
    tasks.push({
      key: "obtain_wholesale_license",
      title: "Obtain or renew the applicant's wholesale license",
      category: "Applicant readiness",
      formHint: "State authority; Form 20B / 21B references",
      guidance:
        "Track the wholesale-license application separately and confirm the competent state licensing authority and current form requirements.",
      isRequired: true,
    });
  }

  if (!input.hasAuthorizedAgent) {
    tasks.push({
      key: "appoint_agent",
      title: "Confirm whether a local representative is required",
      category: "Applicant readiness",
      formHint: null,
      guidance:
        "Verify whether this category and filing route require an Indian representative. If required, record its authorization, scope, and relevant licenses.",
      isRequired: true,
    });
  }

  if (!input.hasImportExportCode) {
    tasks.push({
      key: "obtain_iec",
      title: "Obtain or verify the importer's IEC",
      category: "Applicant readiness",
      formHint: "DGFT",
      guidance:
        "Record the IEC holder and verify its legal name and current status before filing or shipment.",
      isRequired: true,
    });
  }

  return tasks;
}

function scopeFor(user: CurrentUser) {
  if (!user.organizationId) {
    return eq(importComplianceCases.createdBy, user.id);
  }
  return or(
    eq(importComplianceCases.createdBy, user.id),
    eq(importComplianceCases.organizationId, user.organizationId),
  );
}

function normalizeCase(input: CreateImportComplianceCase) {
  return {
    ...input,
    importLicenseExpiresAt: input.importLicenseExpiresAt
      ? new Date(`${input.importLicenseExpiresAt}T00:00:00.000Z`)
      : null,
  };
}

function toCaseView(
  item: typeof importComplianceCases.$inferSelect,
  tasks: (typeof importComplianceTasks.$inferSelect)[],
): ImportComplianceCaseView {
  const taskViews: ImportComplianceTaskView[] = tasks.map((task) => ({
    id: task.id,
    taskKey: task.taskKey,
    title: task.title,
    category: task.category,
    formHint: task.formHint,
    guidance: task.guidance,
    isRequired: task.isRequired,
    isComplete: task.isComplete,
    sortOrder: task.sortOrder,
  }));
  const requiredTasks = taskViews.filter((task) => task.isRequired);
  const completedCount = requiredTasks.filter((task) => task.isComplete).length;

  return {
    id: item.id,
    productName: item.productName,
    applicantName: item.applicantName,
    countryOfOrigin: item.countryOfOrigin,
    productType: item.productType as ImportComplianceCaseView["productType"],
    isScheduleX: item.isScheduleX,
    isNewDrug: item.isNewDrug,
    isFixedDoseCombination: item.isFixedDoseCombination,
    isClinicalTrialImport: item.isClinicalTrialImport,
    isForTesting: item.isForTesting,
    hasWholesaleLicense: item.hasWholesaleLicense,
    hasAuthorizedAgent: item.hasAuthorizedAgent,
    hasImportExportCode: item.hasImportExportCode,
    importLicenseExpiresAt: item.importLicenseExpiresAt?.toISOString() ?? null,
    status: item.status,
    updatedAt: item.updatedAt.toISOString(),
    tasks: taskViews,
    completedCount,
    requiredCount: requiredTasks.length,
    readinessPercent: requiredTasks.length
      ? Math.round((completedCount / requiredTasks.length) * 100)
      : 0,
  };
}

export async function listImportComplianceCases(user: CurrentUser) {
  const cases = await db
    .select()
    .from(importComplianceCases)
    .where(scopeFor(user))
    .orderBy(desc(importComplianceCases.updatedAt));

  if (cases.length === 0) return [];
  const tasks = await db
    .select()
    .from(importComplianceTasks)
    .where(
      inArray(
        importComplianceTasks.caseId,
        cases.map((item) => item.id),
      ),
    )
    .orderBy(importComplianceTasks.sortOrder);
  const tasksByCase = new Map<string, typeof tasks>();
  for (const task of tasks) {
    const existing = tasksByCase.get(task.caseId) ?? [];
    existing.push(task);
    tasksByCase.set(task.caseId, existing);
  }

  return cases.map((item) => toCaseView(item, tasksByCase.get(item.id) ?? []));
}

export async function getImportComplianceCase(
  user: CurrentUser,
  caseId: string,
) {
  const [item] = await db
    .select()
    .from(importComplianceCases)
    .where(and(eq(importComplianceCases.id, caseId), scopeFor(user)))
    .limit(1);
  if (!item) return null;

  const tasks = await db
    .select()
    .from(importComplianceTasks)
    .where(eq(importComplianceTasks.caseId, item.id))
    .orderBy(importComplianceTasks.sortOrder);
  return toCaseView(item, tasks);
}

export async function createImportComplianceCase(
  user: CurrentUser,
  rawInput: unknown,
) {
  const input = createCaseSchema.parse(rawInput);
  const tasks = buildImportComplianceTasks(input);
  const [created] = await db.transaction(async (transaction) => {
    const [newCase] = await transaction
      .insert(importComplianceCases)
      .values({
        ...normalizeCase(input),
        createdBy: user.id,
        organizationId: user.organizationId,
      })
      .returning();
    await transaction.insert(importComplianceTasks).values(
      tasks.map((task, index) => ({
        caseId: newCase.id,
        taskKey: task.key,
        title: task.title,
        category: task.category,
        formHint: task.formHint,
        guidance: task.guidance,
        isRequired: task.isRequired,
        sortOrder: index,
      })),
    );
    return [newCase];
  });
  return created;
}

export async function updateImportComplianceCase(
  user: CurrentUser,
  caseId: string,
  input: Partial<CreateImportComplianceCase>,
) {
  const [updated] = await db
    .update(importComplianceCases)
    .set({
      ...(input.productName !== undefined && {
        productName: input.productName,
      }),
      ...(input.applicantName !== undefined && {
        applicantName: input.applicantName,
      }),
      ...(input.countryOfOrigin !== undefined && {
        countryOfOrigin: input.countryOfOrigin,
      }),
      ...(input.productType !== undefined && {
        productType: input.productType,
      }),
      ...(input.importLicenseExpiresAt !== undefined && {
        importLicenseExpiresAt: input.importLicenseExpiresAt
          ? new Date(`${input.importLicenseExpiresAt}T00:00:00.000Z`)
          : null,
      }),
      updatedAt: new Date(),
    })
    .where(and(eq(importComplianceCases.id, caseId), scopeFor(user)))
    .returning({ id: importComplianceCases.id });
  if (!updated) throw new Error("Compliance case not found.");
}

export async function deleteImportComplianceCase(
  user: CurrentUser,
  caseId: string,
) {
  const [deleted] = await db
    .delete(importComplianceCases)
    .where(and(eq(importComplianceCases.id, caseId), scopeFor(user)))
    .returning({ id: importComplianceCases.id });
  if (!deleted) throw new Error("Compliance case not found.");
}

export async function updateImportComplianceTask(
  user: CurrentUser,
  caseId: string,
  taskId: string,
  isComplete: boolean,
) {
  const [ownedTask] = await db
    .select({ id: importComplianceTasks.id })
    .from(importComplianceTasks)
    .innerJoin(
      importComplianceCases,
      eq(importComplianceTasks.caseId, importComplianceCases.id),
    )
    .where(
      and(
        eq(importComplianceCases.id, caseId),
        eq(importComplianceTasks.id, taskId),
        scopeFor(user),
      ),
    )
    .limit(1);
  if (!ownedTask) throw new Error("Compliance task not found.");

  await db.transaction(async (transaction) => {
    await transaction
      .update(importComplianceTasks)
      .set({
        isComplete,
        completedAt: isComplete ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(importComplianceTasks.id, taskId));

    const [{ pendingCount }] = await transaction
      .select({ pendingCount: count() })
      .from(importComplianceTasks)
      .where(
        and(
          eq(importComplianceTasks.caseId, caseId),
          eq(importComplianceTasks.isRequired, true),
          eq(importComplianceTasks.isComplete, false),
        ),
      );
    await transaction
      .update(importComplianceCases)
      .set({
        status: pendingCount === 0 ? "READY_FOR_REVIEW" : "IN_PROGRESS",
        updatedAt: new Date(),
      })
      .where(eq(importComplianceCases.id, caseId));
  });
}
