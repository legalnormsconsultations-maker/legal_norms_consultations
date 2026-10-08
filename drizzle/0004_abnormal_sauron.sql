CREATE TABLE "demo_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"work_email" varchar(255) NOT NULL,
	"phone_number" varchar(32),
	"company_name" varchar(255) NOT NULL,
	"job_title" varchar(255) NOT NULL,
	"organization_size" varchar(50) NOT NULL,
	"interests" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"additional_notes" text,
	"status" varchar(50) DEFAULT 'NEW' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
