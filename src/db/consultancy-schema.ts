import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  jsonb,
  boolean,
  integer,
  date,
} from "drizzle-orm/pg-core";
import { users, organizations } from "./schema";

export const authorities = pgTable("authorities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(), // e.g. CDSCO, FSSAI
  officialWebsite: varchar("official_website", { length: 500 }),
  regulatoryArea: varchar("regulatory_area", { length: 255 }),
  jurisdiction: varchar("jurisdiction", { length: 255 }),
  portalUrl: varchar("portal_url", { length: 500 }),
  officialResources: jsonb("official_resources").default([]), // array of { title, url }
  forms: jsonb("forms").default([]),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const services = pgTable(
  "services",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    authorityId: uuid("authority_id").references(() => authorities.id),
    parentId: uuid("parent_id"), // self-referencing for hierarchy
    category: varchar("category", { length: 255 }),
    subcategory: varchar("subcategory", { length: 255 }),
    productType: varchar("product_type", { length: 255 }),
    description: text("description"),
    shortDescription: text("short_description"),
    eligibility: text("eligibility"),
    applicants: jsonb("applicants").default([]), // e.g. ["Manufacturer", "Importer"]
    jurisdictions: jsonb("jurisdictions").default([]),
    workflowSteps: jsonb("workflow_steps").default([]), // detailed process stages
    requiredDocuments: jsonb("required_documents").default([]),
    governmentForms: jsonb("government_forms").default([]),
    authorityPortal: varchar("authority_portal", { length: 500 }),
    estimatedTimeline: varchar("estimated_timeline", { length: 255 }),
    feeInformation: jsonb("fee_information"), // { type, amount, currency }
    consultantScope: text("consultant_scope"),
    postApprovalRequirements: text("post_approval_requirements"),
    status: varchar("status", { length: 50 }).default("Draft").notNull(),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export const regulatoryUpdates = pgTable("regulatory_updates", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorityId: uuid("authority_id").references(() => authorities.id),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  announcementDate: date("announcement_date"),
  effectiveDate: date("effective_date"),
  impactLevel: varchar("impact_level", { length: 50 }), // Critical, High, Medium, Low, Informational
  affectedIndustry: jsonb("affected_industry").default([]),
  affectedProducts: jsonb("affected_products").default([]),
  affectedBusinesses: jsonb("affected_businesses").default([]),
  summary: text("summary"),
  whatChanged: text("what_changed"),
  whoIsAffected: text("who_is_affected"),
  complianceActions: text("compliance_actions"),
  complianceDeadline: date("compliance_deadline"),
  consequences: text("consequences"),
  officialSourceUrl: varchar("official_source_url", { length: 500 }),
  status: varchar("status", { length: 50 }).default("Draft").notNull(),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 50 }).notNull(), // Guide, Blog, Case Study, Service Explanation
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  categoryId: varchar("category_id", { length: 255 }),
  authorityId: uuid("authority_id").references(() => authorities.id),
  industry: varchar("industry", { length: 255 }),
  authorId: uuid("author_id").references(() => users.id),
  reviewerId: uuid("reviewer_id").references(() => users.id),
  reviewDate: timestamp("review_date"),
  content: text("content"),
  excerpt: text("excerpt"),
  featuredImage: varchar("featured_image", { length: 500 }),
  readingTime: integer("reading_time"), // in minutes
  status: varchar("status", { length: 50 }).default("Draft").notNull(), // Draft, Internal Review, Regulatory Review, Approved, Published
  tags: jsonb("tags").default([]),
  references: jsonb("references").default([]),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  authorityId: uuid("authority_id").references(() => authorities.id),
  serviceId: uuid("service_id").references(() => services.id),
  category: varchar("category", { length: 255 }),
  tags: jsonb("tags").default([]),
  priority: integer("priority").default(0),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  country: varchar("country", { length: 255 }),
  mobileNumber: varchar("mobile_number", { length: 50 }),
  email: varchar("email", { length: 255 }).notNull(),
  businessType: varchar("business_type", { length: 255 }),
  productCategory: varchar("product_category", { length: 255 }),
  authorityId: uuid("authority_id").references(() => authorities.id),
  serviceId: uuid("service_id").references(() => services.id),
  numberOfSkus: varchar("number_of_skus", { length: 50 }),
  message: text("message"),
  status: varchar("status", { length: 50 }).default("New").notNull(), // New, Contacted, Qualified, Consultation Scheduled, etc.
  sourceUrl: varchar("source_url", { length: 500 }),
  campaign: varchar("campaign", { length: 255 }),
  assignedTo: uuid("assigned_to").references(() => users.id),
  notes: text("notes"),
  nextAction: varchar("next_action", { length: 255 }),
  lastContactAt: timestamp("last_contact_at"),
  priority: varchar("priority", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  sku: varchar("sku", { length: 255 }),
  organizationId: uuid("organization_id").references(() => organizations.id),
  category: varchar("category", { length: 255 }),
  formulation: varchar("formulation", { length: 255 }),
  ingredients: jsonb("ingredients").default([]),
  manufacturer: varchar("manufacturer", { length: 255 }),
  manufacturingSite: varchar("manufacturing_site", { length: 255 }),
  countryOfOrigin: varchar("country_of_origin", { length: 255 }),
  intendedUse: text("intended_use"),
  claims: jsonb("claims").default([]),
  packSize: varchar("pack_size", { length: 255 }),
  regulatoryStatus: varchar("regulatory_status", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// For cross linking
export const articleRelatedServices = pgTable("article_related_services", {
  articleId: uuid("article_id").notNull().references(() => articles.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
});

export const serviceRelatedFaqs = pgTable("service_related_faqs", {
  serviceId: uuid("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
  faqId: uuid("faq_id").notNull().references(() => faqs.id, { onDelete: "cascade" }),
});

export const trustedBrands = pgTable('trusted_brands', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  logoUrl: text('logo_url'),
  iconName: varchar('icon_name', { length: 100 }),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const clientTestimonials = pgTable('client_testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientName: varchar('client_name', { length: 255 }).notNull(),
  occupation: varchar('occupation', { length: 255 }),
  organization: varchar('organization', { length: 255 }),
  profilePicUrl: text('profile_pic_url'),
  rating: integer('rating').default(5).notNull(),
  review: text('review').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const companyLocations = pgTable('company_locations', {
  id: uuid('id').primaryKey().defaultRandom(),
  officeName: varchar('office_name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  phone: varchar('phone', { length: 100 }),
  email: varchar('email', { length: 255 }),
  googleMapsUrl: text('google_maps_url'),
  isPrimary: boolean('is_primary').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const siteSettings = pgTable('site_settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactNumber: varchar('contact_number', { length: 50 }),
  email: varchar('email', { length: 255 }),
  whatsappNumber: varchar('whatsapp_number', { length: 50 }),
  instagramUrl: varchar('instagram_url', { length: 255 }),
  facebookUrl: varchar('facebook_url', { length: 255 }),
  xUrl: varchar('x_url', { length: 255 }),
  linkedinUrl: varchar('linkedin_url', { length: 255 }),
  discordUrl: varchar('discord_url', { length: 255 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
