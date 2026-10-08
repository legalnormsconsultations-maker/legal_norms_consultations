CREATE TABLE "import_compliance_cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_by" uuid NOT NULL,
	"organization_id" uuid,
	"product_name" varchar(255) NOT NULL,
	"applicant_name" varchar(255) NOT NULL,
	"country_of_origin" varchar(100) NOT NULL,
	"product_type" varchar(40) NOT NULL,
	"is_schedule_x" boolean DEFAULT false NOT NULL,
	"is_new_drug" boolean DEFAULT false NOT NULL,
	"is_fixed_dose_combination" boolean DEFAULT false NOT NULL,
	"is_clinical_trial_import" boolean DEFAULT false NOT NULL,
	"is_for_testing" boolean DEFAULT false NOT NULL,
	"has_wholesale_license" boolean DEFAULT false NOT NULL,
	"has_authorized_agent" boolean DEFAULT false NOT NULL,
	"has_import_export_code" boolean DEFAULT false NOT NULL,
	"import_license_expires_at" timestamp,
	"status" varchar(40) DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "import_compliance_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"task_key" varchar(80) NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(40) NOT NULL,
	"form_hint" varchar(100),
	"guidance" text NOT NULL,
	"is_required" boolean DEFAULT true NOT NULL,
	"is_complete" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "import_compliance_case_task_unique" UNIQUE("case_id","task_key")
);
--> statement-breakpoint
ALTER TABLE "import_compliance_cases" ADD CONSTRAINT "import_compliance_cases_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_compliance_cases" ADD CONSTRAINT "import_compliance_cases_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_compliance_tasks" ADD CONSTRAINT "import_compliance_tasks_case_id_import_compliance_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."import_compliance_cases"("id") ON DELETE cascade ON UPDATE no action;