CREATE TABLE "regulatory_signals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference_id" varchar(255) NOT NULL,
	"drug_id" uuid,
	"substance_name" varchar(255),
	"risk_description" text NOT NULL,
	"affected_population" text,
	"regulatory_action" varchar(255),
	"current_status" varchar(100) NOT NULL,
	"timeline" jsonb,
	"risk_profile" jsonb,
	"product_info_change" jsonb,
	"evidence" jsonb,
	"action_tracker" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "regulatory_signals_reference_id_unique" UNIQUE("reference_id")
);
--> statement-breakpoint
ALTER TABLE "regulatory_signals" ADD CONSTRAINT "regulatory_signals_drug_id_drugs_id_fk" FOREIGN KEY ("drug_id") REFERENCES "public"."drugs"("id") ON DELETE no action ON UPDATE no action;