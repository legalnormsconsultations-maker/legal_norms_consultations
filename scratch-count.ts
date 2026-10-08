import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { count } from "drizzle-orm";
import { db } from "./src/db/index";
import { drugs } from "./src/db/schema";

async function main() {
  try {
    // try db.$count
    const c = await db.$count(drugs);
    console.log("db.$count returns:", typeof c, c);
  } catch (err) {
    console.error("db.$count error:", err);
  }

  try {
    // try select({ total: count() })
    const res = await db.select({ total: count() }).from(drugs);
    console.log("select count() returns:", res);
  } catch (err) {
    console.error("select count() error:", err);
  }
  process.exit();
}

main();
