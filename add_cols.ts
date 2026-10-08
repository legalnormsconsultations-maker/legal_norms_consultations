import { sql } from "drizzle-orm";
import { db } from "./src/db";

async function run() {
  try {
    await db.execute(
      sql`ALTER TABLE regulatory_intelligence ADD COLUMN IF NOT EXISTS summary TEXT`,
    );
    await db.execute(
      sql`ALTER TABLE regulatory_intelligence ADD COLUMN IF NOT EXISTS agency VARCHAR(255)`,
    );
    await db.execute(
      sql`ALTER TABLE regulatory_intelligence ADD COLUMN IF NOT EXISTS impact_level VARCHAR(255)`,
    );
    await db.execute(
      sql`ALTER TABLE regulatory_intelligence ADD COLUMN IF NOT EXISTS full_content TEXT`,
    );
    console.log("Columns added.");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
