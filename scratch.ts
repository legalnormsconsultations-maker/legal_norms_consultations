import { config } from 'dotenv';
config({ path: '.env.local' });
import { sql } from 'drizzle-orm';

async function main() {
  const { db } = await import('./src/db');
  const res = await db.execute(sql`SELECT count(*) FROM "regulatory_signals" WHERE "regulatory_signals"."current_status" <> 'Completed'`);
  console.log(res);
  process.exit(0);
}

main();
