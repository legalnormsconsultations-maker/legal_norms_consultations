CREATE TABLE "client_testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" varchar(255) NOT NULL,
	"occupation" varchar(255),
	"organization" varchar(255),
	"profile_pic_url" text,
	"rating" integer DEFAULT 5 NOT NULL,
	"review" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_locations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"office_name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"phone" varchar(100),
	"email" varchar(255),
	"google_maps_url" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_number" varchar(50),
	"email" varchar(255),
	"whatsapp_number" varchar(50),
	"instagram_url" varchar(255),
	"facebook_url" varchar(255),
	"x_url" varchar(255),
	"linkedin_url" varchar(255),
	"discord_url" varchar(255),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
