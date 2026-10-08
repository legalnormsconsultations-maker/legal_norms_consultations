import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { and, eq, gt, isNull } from "drizzle-orm";
import { db } from "./src/db/index";
import { authSessions, users } from "./src/db/schema";
import { hashOpaqueToken } from "./src/lib/auth/crypto";

async function main() {
  const token = "12345"; // dummy token
  try {
    const [record] = await db
      .select({ user: users })
      .from(authSessions)
      .innerJoin(users, eq(authSessions.userId, users.id))
      .where(
        and(
          eq(authSessions.tokenHash, hashOpaqueToken(token)),
          isNull(authSessions.revokedAt),
          gt(authSessions.expiresAt, new Date()),
          eq(users.isActive, true),
        ),
      )
      .limit(1);
    console.log("Success:", record);
  } catch (err) {
    console.error("Drizzle Error:", err);
  } finally {
    process.exit();
  }
}

main();
