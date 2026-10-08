import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    passwordHash: text("password_hash"),
    phoneNumber: varchar("phone_number", { length: 32 }),
    phoneVerified: boolean("phone_verified").default(false).notNull(),
    roles: jsonb("roles").default([]).notNull(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    // Note: Granular role mapping handled by user_roles and rbac modules below
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),
    title: varchar("title", { length: 255 }), // e.g., Chief Medical Officer
    organization: varchar("organization", { length: 255 }),
    professionalSummary: text("professional_summary"),
    expertise: jsonb("expertise"), // Array of tags
    medicalInterests: jsonb("medical_interests"),
    avatarUrl: text("avatar_url"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailLowerUnique: uniqueIndex("users_email_lower_unique").on(
      sql`lower(${table.email})`,
    ),
    phoneUnique: uniqueIndex("users_phone_unique").on(table.phoneNumber),
  }),
);

export const authAccounts = pgTable(
  "auth_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 40 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    providerAccountUnique: unique("auth_accounts_provider_account_unique").on(
      table.provider,
      table.providerAccountId,
    ),
  }),
);

export const authSessions = pgTable("auth_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: varchar("token_hash", { length: 64 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const authChallenges = pgTable("auth_challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  challengeType: varchar("challenge_type", { length: 40 }).notNull(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  tokenHash: varchar("token_hash", { length: 64 }).notNull(),
  metadata: jsonb("metadata"),
  expiresAt: timestamp("expires_at").notNull(),
  consumedAt: timestamp("consumed_at"),
  attempts: integer("attempts").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const authRateLimits = pgTable("auth_rate_limits", {
  id: uuid("id").primaryKey().defaultRandom(),
  keyHash: varchar("key_hash", { length: 64 }).notNull().unique(),
  action: varchar("action", { length: 40 }).notNull(),
  count: integer("count").default(1).notNull(),
  windowStartedAt: timestamp("window_started_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const portfolioItems = pgTable("portfolio_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }), // e.g., Device, Drug, Biologic
  phase: varchar("phase", { length: 100 }), // e.g., Pre-clinical, Phase I, Phase II
  ownerId: uuid("owner_id").references(() => users.id),
  drugId: uuid("drug_id").references(() => drugs.id),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  organizationId: uuid("organization_id"), // Not a strict FK to allow org deletion without breaking audit history
  action: varchar("action", { length: 100 }).notNull(), // e.g. login, document_upload
  resourceType: varchar("resource_type", { length: 100 }).notNull(),
  resourceId: varchar("resource_id", { length: 100 }),
  requestId: varchar("request_id", { length: 100 }), // Ties directly to api-utils.ts generated requestId
  severity: varchar("severity", { length: 20 }).default("low").notNull(), // low, medium, high

  // Change Summaries
  beforeState: jsonb("before_state"),
  afterState: jsonb("after_state"),
  details: jsonb("details"),

  // Metadata
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Multi-Jurisdiction Architecture Module ---

export const jurisdictions = pgTable("jurisdictions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., United States, European Union
  regionCode: varchar("region_code", { length: 10 }).notNull().unique(), // US, EU, IN, JP
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const regulatoryAuthorities = pgTable("regulatory_authorities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., FDA, EMA, CDSCO
  acronym: varchar("acronym", { length: 50 }).notNull(),
  jurisdictionId: uuid("jurisdiction_id").references(() => jurisdictions.id),
  websiteUrl: text("website_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Drug Database Module ---

export const manufacturers = pgTable("manufacturers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: text("logo_url"),
  companyProfile: text("company_profile"),
  headquarters: varchar("headquarters", { length: 255 }),
  country: varchar("country", { length: 100 }),
  websiteUrl: text("website_url"),
  manufacturingSites: jsonb("manufacturing_sites"), // Array of site details
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const drugs = pgTable(
  "drugs",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // 1. Identity
    drugName: varchar("drug_name", { length: 255 }).notNull(),
    genericName: varchar("generic_name", { length: 255 }),
    brandName: varchar("brand_name", { length: 255 }),
    brandNames: jsonb("brand_names"),
    manufacturer: varchar("manufacturer", { length: 255 }),
    activeIngredients: jsonb("active_ingredients"),
    molecularInformation: jsonb("molecular_information"),
    dosageForms: jsonb("dosage_forms"),
    strengths: jsonb("strengths"),
    routeOfAdministration: jsonb("route_of_administration"),
    therapeuticCategories: jsonb("therapeutic_categories"),
    status: varchar("status", { length: 100 })
      .default("INVESTIGATIONAL")
      .notNull(),
    documents: jsonb("documents"),

    // 3. Manufacturer Link
    manufacturerId: uuid("manufacturer_id").references(() => manufacturers.id),

    // 5. Scientific Information
    mechanismOfAction: text("mechanism_of_action"),
    pharmacologicalClass: varchar("pharmacological_class", { length: 255 }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      drugNameManufacturerIdx: unique("drug_name_manufacturer_idx").on(
        table.drugName,
        table.manufacturerId,
      ),
    };
  },
);

// --- Regulatory Lifecycle Module ---

export const regulatoryApplications = pgTable(
  "regulatory_applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    drugId: uuid("drug_id").references(() => drugs.id),
    authorityId: uuid("authority_id").references(
      () => regulatoryAuthorities.id,
    ),
    applicationNumber: varchar("application_number", { length: 100 }).notNull(), // e.g., NDA 019872
    applicationType: varchar("application_type", { length: 100 }), // NDA, BLA, MAA
    regulatoryPathway: varchar("regulatory_pathway", { length: 100 }), // e.g. 505(b)(2), Centralised Procedure
    status: varchar("status", { length: 100 }).notNull(), // Submitted, Under Review, Approved, Rejected
    submissionDate: timestamp("submission_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      appNumberAuthorityIdx: unique("app_number_authority_idx").on(
        table.applicationNumber,
        table.authorityId,
      ),
    };
  },
);

export const approvals = pgTable("approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  applicationId: uuid("application_id").references(
    () => regulatoryApplications.id,
  ),
  drugId: uuid("drug_id").references(() => drugs.id),
  authorityId: uuid("authority_id").references(() => regulatoryAuthorities.id),
  approvalDate: timestamp("approval_date").notNull(),
  marketStatus: varchar("market_status", { length: 100 }), // Prescription, OTC, Orphan
  restrictions: text("restrictions"), // e.g. REMS
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Extensible Documentation (S3 Object Storage Compatible)
export const regulatoryDocuments = pgTable("regulatory_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  drugId: uuid("drug_id").references(() => drugs.id),
  authorityId: uuid("authority_id").references(() => regulatoryAuthorities.id),
  title: varchar("title", { length: 255 }).notNull(),
  documentType: varchar("document_type", { length: 100 }).notNull(), // label, assessment_report, public_regulatory

  // Storage Metadata
  objectKey: text("object_key").notNull(),
  bucketName: varchar("bucket_name", { length: 100 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  checksum: varchar("checksum", { length: 255 }), // SHA-256
  accessLevel: varchar("access_level", { length: 50 })
    .default("public")
    .notNull(),
  version: integer("version").default(1).notNull(),
  isScanPassed: boolean("is_scan_passed").default(false), // Antivirus integration

  publishedDate: timestamp("published_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const safetyUpdates = pgTable("safety_updates", {
  id: uuid("id").primaryKey().defaultRandom(),
  drugId: uuid("drug_id").references(() => drugs.id),
  authorityId: uuid("authority_id").references(() => regulatoryAuthorities.id),
  title: varchar("title", { length: 255 }).notNull(),
  severity: varchar("severity", { length: 50 }).notNull(), // Boxed Warning, Precaution, Recall
  description: text("description").notNull(),
  issuedDate: timestamp("issued_date").notNull(),
  documentId: uuid("document_id").references(() => regulatoryDocuments.id), // Link to warning letter
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const regulatoryEvents = pgTable(
  "regulatory_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    drugId: uuid("drug_id").references(() => drugs.id),
    authorityId: uuid("authority_id").references(
      () => regulatoryAuthorities.id,
    ),
    eventType: varchar("event_type", { length: 100 }).notNull(), // approval, status_change, labeling_update
    eventTitle: varchar("event_title", { length: 255 }).notNull(),
    eventTimestamp: timestamp("event_timestamp").notNull(),
    milestonePhase: varchar("milestone_phase", { length: 100 }), // Development, Submission, Review, Approval, Post-Market
    sourceUrl: text("source_url"),
    sourceName: varchar("source_name", { length: 255 }),
    documentId: uuid("document_id").references(() => regulatoryDocuments.id),
    metadata: jsonb("metadata"), // Structured metadata payload
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      drugAuthorityEventIdx: unique("drug_authority_event_idx").on(
        table.drugId,
        table.authorityId,
        table.eventType,
        table.eventTimestamp,
      ),
    };
  },
);

export const drugReferences = pgTable("drug_references", {
  id: uuid("id").primaryKey().defaultRandom(),
  drugId: uuid("drug_id").references(() => drugs.id),
  title: text("title").notNull(),
  referenceType: varchar("reference_type", { length: 100 }).notNull(), // research, clinical_evidence
  url: text("url"),
  authors: jsonb("authors"),
  publicationDate: timestamp("publication_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const regulatorySubmissions = pgTable("regulatory_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("draft").notNull(),
  submittedBy: uuid("submitted_by").references(() => users.id),
  authorityId: uuid("authority_id").references(() => regulatoryAuthorities.id),
  documentUrl: text("document_url"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const importComplianceCases = pgTable("import_compliance_cases", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").references(() => organizations.id, {
    onDelete: "cascade",
  }),
  productName: varchar("product_name", { length: 255 }).notNull(),
  applicantName: varchar("applicant_name", { length: 255 }).notNull(),
  countryOfOrigin: varchar("country_of_origin", { length: 100 }).notNull(),
  productType: varchar("product_type", { length: 40 }).notNull(),
  isScheduleX: boolean("is_schedule_x").default(false).notNull(),
  isNewDrug: boolean("is_new_drug").default(false).notNull(),
  isFixedDoseCombination: boolean("is_fixed_dose_combination")
    .default(false)
    .notNull(),
  isClinicalTrialImport: boolean("is_clinical_trial_import")
    .default(false)
    .notNull(),
  isForTesting: boolean("is_for_testing").default(false).notNull(),
  hasWholesaleLicense: boolean("has_wholesale_license")
    .default(false)
    .notNull(),
  hasAuthorizedAgent: boolean("has_authorized_agent").default(false).notNull(),
  hasImportExportCode: boolean("has_import_export_code")
    .default(false)
    .notNull(),
  importLicenseExpiresAt: timestamp("import_license_expires_at"),
  status: varchar("status", { length: 40 }).default("DRAFT").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const importComplianceTasks = pgTable(
  "import_compliance_tasks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    caseId: uuid("case_id")
      .notNull()
      .references(() => importComplianceCases.id, { onDelete: "cascade" }),
    taskKey: varchar("task_key", { length: 80 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    category: varchar("category", { length: 40 }).notNull(),
    formHint: varchar("form_hint", { length: 100 }),
    guidance: text("guidance").notNull(),
    isRequired: boolean("is_required").default(true).notNull(),
    isComplete: boolean("is_complete").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    caseTaskUnique: unique("import_compliance_case_task_unique").on(
      table.caseId,
      table.taskKey,
    ),
  }),
);

// --- Research Module ---

export const researchArticles = pgTable("research_articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  abstract: text("abstract"),
  authors: jsonb("authors"), // Array of author objects { name, organization }
  categories: jsonb("categories"), // Array of research categories/tags
  publicationDate: timestamp("publication_date"),
  publisher: varchar("publisher", { length: 255 }), // Journal or Organization

  // Citation & References
  doi: varchar("doi", { length: 100 }), // Digital Object Identifier
  citation: text("citation"), // Formatted citation string
  url: text("url"),
  externalReferences: jsonb("external_references"), // Array of linked URLs/IDs
  sourceMetadata: jsonb("source_metadata"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// --- Medical Portfolio Module ---

export const portfolioProjects = pgTable("portfolio_projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  url: text("url"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioPublications = pgTable("portfolio_publications", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  publisher: varchar("publisher", { length: 255 }),
  url: text("url"),
  publicationDate: timestamp("publication_date"),
  authors: jsonb("authors"), // Array of co-authors
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioCertifications = pgTable("portfolio_certifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  issuingOrganization: varchar("issuing_organization", { length: 255 }),
  issueDate: timestamp("issue_date"),
  expirationDate: timestamp("expiration_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const portfolioDocuments = pgTable("portfolio_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: uuid("owner_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  documentType: varchar("document_type", { length: 100 }), // Presentation, Report, General

  // Storage Metadata
  objectKey: text("object_key").notNull(),
  bucketName: varchar("bucket_name", { length: 100 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  checksum: varchar("checksum", { length: 255 }), // SHA-256
  accessLevel: varchar("access_level", { length: 50 })
    .default("private")
    .notNull(), // Defaults to private for user portfolios
  version: integer("version").default(1).notNull(),
  isScanPassed: boolean("is_scan_passed").default(false),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Enterprise Role-Based Access Control (RBAC) Module ---

export const rbacPermissions = pgTable("rbac_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g., 'drugs:write', 'users:delete'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rbacRoles = pgTable("rbac_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g., 'Super Admin', 'Medical Professional'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rbacRolePermissions = pgTable("rbac_role_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleId: uuid("role_id").references(() => rbacRoles.id),
  permissionId: uuid("permission_id").references(() => rbacPermissions.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const rbacUserRoles = pgTable("rbac_user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  roleId: uuid("role_id").references(() => rbacRoles.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Enterprise Multi-Tenant / Organization Module ---

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // e.g. /org/acme-pharma
  domain: varchar("domain", { length: 255 }), // For email matching or SSO
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const organizationRoles = pgTable("organization_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  name: varchar("name", { length: 100 }).notNull(), // e.g., 'Org Admin', 'Member'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const organizationPermissions = pgTable("organization_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleId: uuid("role_id").references(() => organizationRoles.id),
  permissionName: varchar("permission_name", { length: 100 }).notNull(), // e.g., 'org:invite', 'org:billing'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id),
  userId: uuid("user_id").references(() => users.id),
  roleId: uuid("role_id").references(() => organizationRoles.id), // Direct link to their org-specific role
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export const documents = regulatoryDocuments;

// --- Background Jobs Module (Async Processing) ---

export const backgroundJobs = pgTable("background_jobs", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobType: varchar("job_type", { length: 100 }).notNull(),
  payload: jsonb("payload").notNull(),
  status: varchar("status", { length: 50 }).default("QUEUED").notNull(), // QUEUED, PROCESSING, COMPLETED, FAILED
  attempts: integer("attempts").default(0).notNull(),
  maxRetries: integer("max_retries").default(3).notNull(),
  error: text("error"),
  lockedAt: timestamp("locked_at"),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const demoRequests = pgTable("demo_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  workEmail: varchar("work_email", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 32 }),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  jobTitle: varchar("job_title", { length: 255 }).notNull(),
  organizationSize: varchar("organization_size", { length: 50 }).notNull(),
  interests: jsonb("interests").default([]).notNull(), // array of strings
  additionalNotes: text("additional_notes"),
  status: varchar("status", { length: 50 }).default("NEW").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 150 }).notNull(),
  workEmail: varchar("work_email", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("NEW").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Platform Telemetry & Pipelines Module ---

export const apiTelemetry = pgTable("api_telemetry", {
  id: uuid("id").primaryKey().defaultRandom(),
  endpoint: varchar("endpoint", { length: 255 }).notNull(),
  method: varchar("method", { length: 10 }).notNull(),
  statusCode: integer("status_code").notNull(),
  responseTimeMs: integer("response_time_ms").notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  keyHash: varchar("key_hash", { length: 255 }).notNull().unique(),
  clientId: varchar("client_id", { length: 100 }).notNull(),
  organizationId: varchar("organization_id", { length: 100 }).notNull(),
  scopes: jsonb("scopes").default([]).notNull(), // array of strings
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ingestionPipelines = pgTable("ingestion_pipelines", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceName: varchar("source_name", { length: 255 }).notNull(), // e.g. FDA openFDA API
  status: varchar("status", { length: 50 }).notNull(), // Syncing, Success, Failed
  progress: integer("progress").default(0), // 0 to 100
  lastRunAt: timestamp("last_run_at").defaultNow().notNull(),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Advanced CMS / Admin Content Module ---

export const cmsCategories = pgTable("cms_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  themeGradient: varchar("theme_gradient", { length: 255 }), // e.g. from-blue-500 to-purple-500
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const cmsContent = pgTable("cms_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id").references(() => cmsCategories.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  contentType: varchar("content_type", { length: 100 }).notNull(), // video, photo, pdf, figma, medicine, cosmetic, ad, etc.
  mediaUrl: text("media_url"), // S3 / CDN link
  thumbnailUrl: text("thumbnail_url"),
  richTextBody: text("rich_text_body"), // Rich text HTML or JSON
  mediaSizes: jsonb("media_sizes"), // Customizable sizes like { width, height, aspect_ratio }
  metadata: jsonb("metadata"), // Extensible properties based on content type
  seoMetadata: jsonb("seo_metadata"), // { title, description, keywords, ogImage }
  status: varchar("status", { length: 50 }).default("published").notNull(),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const regulatoryResources = pgTable("regulatory_resources", {
  id: uuid("id").primaryKey().defaultRandom(),
  authority: varchar("authority", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  url: text("url").notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const regulatoryIntelligence = pgTable("regulatory_intelligence", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  dateString: varchar("date_string", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  summary: text("summary"),
  agency: varchar("agency", { length: 255 }),
  impactLevel: varchar("impact_level", { length: 255 }),
  fullContent: text("full_content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const regulatorySubscriptions = pgTable("regulatory_subscriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  recordId: varchar("record_id", { length: 255 }).notNull(),
  userId: varchar("user_id", { length: 255 }), // Simplified to varchar for demo if no session available
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const regulatoryAssignments = pgTable("regulatory_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  recordId: varchar("record_id", { length: 255 }).notNull(),
  assigneeName: varchar("assignee_name", { length: 255 }).notNull(),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const regulatoryImpactAssessments = pgTable(
  "regulatory_impact_assessments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recordId: varchar("record_id", { length: 255 }).notNull(),
    affectedProducts: jsonb("affected_products").notNull(),
    impactLevel: varchar("impact_level", { length: 50 }).notNull(),
    complianceDeadline: varchar("compliance_deadline", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
);

export const fdaGuidances = pgTable("fda_guidances", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 512 }).notNull(),
  type: varchar("type", { length: 100 }),
  status: varchar("status", { length: 50 }),
  center: varchar("center", { length: 50 }),
  office: varchar("office", { length: 100 }),
  topic: varchar("topic", { length: 255 }),
  docketNumber: varchar("docket_number", { length: 100 }).unique(),
  issueDate: timestamp("issue_date"),
  commentOpeningDate: timestamp("comment_opening_date"),
  commentClosingDate: timestamp("comment_closing_date"),
  supersedes: jsonb("supersedes"),
  supersededBy: jsonb("superseded_by"),
  relatedGuidances: jsonb("related_guidances"),
  officialPdfUrl: text("official_pdf_url"),
  federalRegisterNoticeUrl: text("federal_register_notice_url"),
  sourceUrl: text("source_url"),
  aiExecutiveSummary: jsonb("ai_executive_summary"),
  aiDiffAnalysis: jsonb("ai_diff_analysis"),
  aiRegulatoryImpact: jsonb("ai_regulatory_impact"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const regulatoryTasks = pgTable("regulatory_tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  guidanceId: uuid("guidance_id").references(() => fdaGuidances.id),
  assigneeId: uuid("assignee_id").references(() => users.id),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pageContents = pgTable("page_contents", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageName: varchar("page_name", { length: 100 }).notNull(), // 'about', 'services', 'portfolio', 'blog', 'contact'
  
  category: varchar("category", { length: 255 }),
  subcategory: varchar("subcategory", { length: 255 }),
  bundle: varchar("bundle", { length: 255 }),
  pagination: varchar("pagination", { length: 255 }),

  title: varchar("title", { length: 255 }),
  description: text("description"),
  richTextContent: text("rich_text_content"),
  
  mediaUrl: text("media_url"),
  mediaType: varchar("media_type", { length: 50 }), // 'image', 'video', 'pdf', 'document'
  mediaWidth: varchar("media_width", { length: 50 }),
  mediaHeight: varchar("media_height", { length: 50 }),
  
  cardType: varchar("card_type", { length: 50 }).default("normal").notNull(),
  cardWidth: varchar("card_width", { length: 50 }),
  cardHeight: varchar("card_height", { length: 50 }),
  
  imageUrl: text("image_url"), // legacy fallback
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export * from "./consultancy-schema";

export const regulatorySignals = pgTable("regulatory_signals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referenceId: varchar("reference_id", { length: 255 }).notNull().unique(), // e.g. EMA-PRAC-2026-001
  drugId: uuid("drug_id").references(() => drugs.id),
  substanceName: varchar("substance_name", { length: 255 }), // e.g. Ozempic (semaglutide)
  riskDescription: text("risk_description").notNull(),
  affectedPopulation: text("affected_population"),
  regulatoryAction: varchar("regulatory_action", { length: 255 }),
  currentStatus: varchar("current_status", { length: 100 }).notNull(),

  timeline: jsonb("timeline"), // Array of { stage, status, date, evidence }
  riskProfile: jsonb("risk_profile"), // Object with type, severity, frequency, etc.
  productInfoChange: jsonb("product_info_change"), // Object with section, before, after, type
  evidence: jsonb("evidence"), // Object with source, types, etc.
  actionTracker: jsonb("action_tracker"), // Array of { action, status, date }

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
