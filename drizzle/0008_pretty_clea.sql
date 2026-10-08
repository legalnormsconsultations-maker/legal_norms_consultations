CREATE TABLE "regulatory_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"record_id" varchar(255) NOT NULL,
	"assignee_name" varchar(255) NOT NULL,
	"message" text,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regulatory_impact_assessments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"record_id" varchar(255) NOT NULL,
	"affected_products" jsonb NOT NULL,
	"impact_level" varchar(50) NOT NULL,
	"compliance_deadline" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "regulatory_subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"record_id" varchar(255) NOT NULL,
	"user_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "regulatory_intelligence" ADD COLUMN "summary" text;--> statement-breakpoint
ALTER TABLE "regulatory_intelligence" ADD COLUMN "agency" varchar(255);--> statement-breakpoint
ALTER TABLE "regulatory_intelligence" ADD COLUMN "impact_level" varchar(255);--> statement-breakpoint
ALTER TABLE "regulatory_intelligence" ADD COLUMN "full_content" text;