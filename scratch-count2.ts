import { count } from "drizzle-orm";
import { db } from "./src/db/index";
import { drugs } from "./src/db/schema";

async function main() {
  try {
    const c = await db.$count(drugs);
    console.log("db.$count returns:", typeof c, c);
  } catch (err) {
    console.error("db.$count error:", err);
  }
  process.exit();
}

main();
