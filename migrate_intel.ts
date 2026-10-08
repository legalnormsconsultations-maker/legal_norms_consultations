import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL as string, { ssl: "require" });

async function run() {
  await sql`
    CREATE TABLE IF NOT EXISTS "regulatory_intelligence" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "title" varchar(255) NOT NULL,
      "date_string" varchar(50) NOT NULL,
      "status" varchar(50) NOT NULL,
      "summary" text,
      "agency" varchar(255),
      "impact_level" varchar(255),
      "full_content" text,
      "created_at" timestamp DEFAULT now() NOT NULL
    );
  `;

  await sql`ALTER TABLE "regulatory_intelligence" ADD COLUMN IF NOT EXISTS "summary" text;`;
  await sql`ALTER TABLE "regulatory_intelligence" ADD COLUMN IF NOT EXISTS "agency" varchar(255);`;
  await sql`ALTER TABLE "regulatory_intelligence" ADD COLUMN IF NOT EXISTS "impact_level" varchar(255);`;
  await sql`ALTER TABLE "regulatory_intelligence" ADD COLUMN IF NOT EXISTS "full_content" text;`;

  await sql`
    TRUNCATE TABLE "regulatory_intelligence";
  `;

  await sql`
    INSERT INTO "regulatory_intelligence" ("title", "date_string", "status", "summary", "agency", "impact_level", "full_content") VALUES 
      (
        'FDA Guidance Update', 
        'Today', 
        'Critical',
        'New guidance on clinical trial diversity and inclusion criteria.',
        'FDA',
        'High',
        'The FDA has issued an immediate guidance update mandating expanded diversity metrics in Phase III clinical trials. Sponsors must submit detailed diversity action plans prior to pivotal trial initiation. This update affects all ongoing NDAs and supplements currently under review. The directive aims to ensure investigational drugs are tested on populations that accurately reflect the demographics of patients who will ultimately use the therapies.'
      ),
      (
        'EMA Safety Alert', 
        'Yesterday', 
        'Warning',
        'Adverse event reporting requirements for novel biologics.',
        'EMA',
        'Medium',
        'The European Medicines Agency (EMA) has raised a safety alert regarding post-market surveillance of novel biologics. Following a series of uncharacterized adverse events in the broader European market, the Pharmacovigilance Risk Assessment Committee (PRAC) is enforcing a 15-day expedited reporting window for any suspected severe reactions. Marketing authorization holders must update their Risk Management Plans (RMPs) within the next quarter.'
      ),
      (
        'New Drug Application (NDA) Trends', 
        'This Week', 
        'Info',
        'Q3 submission volumes and approval timelines analysis.',
        'Global Health Authorities',
        'Low',
        'Analysis of Q3 NDA submissions indicates a 14% year-over-year increase in oncology and rare disease filings. However, average approval timelines have extended by an estimated 2.3 weeks due to staffing constraints across major health authorities. Fast-track and breakthrough designations remain highly prioritized, with an 85% success rate for first-cycle approvals in these categories.'
      );
  `;

  console.log("Migration and seed completed.");
  process.exit(0);
}

run().catch(console.error);
