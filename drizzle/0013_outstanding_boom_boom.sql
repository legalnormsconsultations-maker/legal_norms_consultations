ALTER TABLE "page_contents" ALTER COLUMN "title" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "page_contents" ADD COLUMN "category" varchar(255);--> statement-breakpoint
ALTER TABLE "page_contents" ADD COLUMN "subcategory" varchar(255);--> statement-breakpoint
ALTER TABLE "page_contents" ADD COLUMN "bundle" varchar(255);--> statement-breakpoint
ALTER TABLE "page_contents" ADD COLUMN "pagination" varchar(255);--> statement-breakpoint
ALTER TABLE "page_contents" ADD COLUMN "rich_text_content" text;--> statement-breakpoint
ALTER TABLE "page_contents" ADD COLUMN "media_url" text;--> statement-breakpoint
ALTER TABLE "page_contents" ADD COLUMN "media_type" varchar(50);--> statement-breakpoint
ALTER TABLE "page_contents" ADD COLUMN "card_type" varchar(50) DEFAULT 'normal' NOT NULL;--> statement-breakpoint
ALTER TABLE "page_contents" ADD COLUMN "card_width" varchar(50);--> statement-breakpoint
ALTER TABLE "page_contents" ADD COLUMN "card_height" varchar(50);