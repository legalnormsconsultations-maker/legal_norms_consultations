CREATE TABLE "auth_rate_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key_hash" varchar(64) NOT NULL,
	"action" varchar(40) NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"window_started_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_rate_limits_key_hash_unique" UNIQUE("key_hash")
);
