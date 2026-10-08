CREATE TABLE "article_related_services" (
	"article_id" uuid NOT NULL,
	"service_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(50) NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"category_id" varchar(255),
	"authority_id" uuid,
	"industry" varchar(255),
	"author_id" uuid,
	"reviewer_id" uuid,
	"review_date" timestamp,
	"content" text,
	"excerpt" text,
	"featured_image" varchar(500),
	"reading_time" integer,
	"status" varchar(50) DEFAULT 'Draft' NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"references" jsonb DEFAULT '[]'::jsonb,
	"seo_title" varchar(255),
	"seo_description" text,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "authorities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"official_website" varchar(500),
	"regulatory_area" varchar(255),
	"jurisdiction" varchar(255),
	"portal_url" varchar(500),
	"official_resources" jsonb DEFAULT '[]'::jsonb,
	"forms" jsonb DEFAULT '[]'::jsonb,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"authority_id" uuid,
	"service_id" uuid,
	"category" varchar(255),
	"tags" jsonb DEFAULT '[]'::jsonb,
	"priority" integer DEFAULT 0,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"company" varchar(255),
	"country" varchar(255),
	"mobile_number" varchar(50),
	"email" varchar(255) NOT NULL,
	"business_type" varchar(255),
	"product_category" varchar(255),
	"authority_id" uuid,
	"service_id" uuid,
	"number_of_skus" varchar(50),
	"message" text,
	"status" varchar(50) DEFAULT 'New' NOT NULL,
	"source_url" varchar(500),
	"campaign" varchar(255),
	"assigned_to" uuid,
	"notes" text,
	"next_action" varchar(255),
	"last_contact_at" timestamp,
	"priority" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"sku" varchar(255),
	"organization_id" uuid,
	"category" varchar(255),
	"formulation" varchar(255),
	"ingredients" jsonb DEFAULT '[]'::jsonb,
	"manufacturer" varchar(255),
	"manufacturing_site" varchar(255),
	"country_of_origin" varchar(255),
	"intended_use" text,
	"claims" jsonb DEFAULT '[]'::jsonb,
	"pack_size" varchar(255),
	"regulatory_status" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regulatory_updates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"authority_id" uuid,
	"title" varchar(500) NOT NULL,
	"slug" varchar(500) NOT NULL,
	"announcement_date" date,
	"effective_date" date,
	"impact_level" varchar(50),
	"affected_industry" jsonb DEFAULT '[]'::jsonb,
	"affected_products" jsonb DEFAULT '[]'::jsonb,
	"affected_businesses" jsonb DEFAULT '[]'::jsonb,
	"summary" text,
	"what_changed" text,
	"who_is_affected" text,
	"compliance_actions" text,
	"compliance_deadline" date,
	"consequences" text,
	"official_source_url" varchar(500),
	"status" varchar(50) DEFAULT 'Draft' NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "regulatory_updates_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "service_related_faqs" (
	"service_id" uuid NOT NULL,
	"faq_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"authority_id" uuid,
	"parent_id" uuid,
	"category" varchar(255),
	"subcategory" varchar(255),
	"product_type" varchar(255),
	"description" text,
	"short_description" text,
	"eligibility" text,
	"applicants" jsonb DEFAULT '[]'::jsonb,
	"jurisdictions" jsonb DEFAULT '[]'::jsonb,
	"workflow_steps" jsonb DEFAULT '[]'::jsonb,
	"required_documents" jsonb DEFAULT '[]'::jsonb,
	"government_forms" jsonb DEFAULT '[]'::jsonb,
	"authority_portal" varchar(500),
	"estimated_timeline" varchar(255),
	"fee_information" jsonb,
	"consultant_scope" text,
	"post_approval_requirements" text,
	"status" varchar(50) DEFAULT 'Draft' NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "article_related_services" ADD CONSTRAINT "article_related_services_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_related_services" ADD CONSTRAINT "article_related_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_authority_id_authorities_id_fk" FOREIGN KEY ("authority_id") REFERENCES "public"."authorities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_authority_id_authorities_id_fk" FOREIGN KEY ("authority_id") REFERENCES "public"."authorities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_authority_id_authorities_id_fk" FOREIGN KEY ("authority_id") REFERENCES "public"."authorities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulatory_updates" ADD CONSTRAINT "regulatory_updates_authority_id_authorities_id_fk" FOREIGN KEY ("authority_id") REFERENCES "public"."authorities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_related_faqs" ADD CONSTRAINT "service_related_faqs_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_related_faqs" ADD CONSTRAINT "service_related_faqs_faq_id_faqs_id_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_authority_id_authorities_id_fk" FOREIGN KEY ("authority_id") REFERENCES "public"."authorities"("id") ON DELETE no action ON UPDATE no action;