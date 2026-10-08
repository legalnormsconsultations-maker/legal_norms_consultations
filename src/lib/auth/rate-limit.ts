import "server-only";

import { sql } from "drizzle-orm";
import { db } from "@/db";
import { authRateLimits } from "@/db/schema";
import { hashChallenge } from "@/lib/auth/crypto";

export async function consumeAuthLimit(input: {
  action: string;
  key: string;
  maximum: number;
  windowMs: number;
}): Promise<void> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - input.windowMs);
  const keyHash = hashChallenge(`${input.action}:${input.key.toLowerCase()}`);
  const [result] = await db
    .insert(authRateLimits)
    .values({ keyHash, action: input.action, count: 1, windowStartedAt: now })
    .onConflictDoUpdate({
      target: authRateLimits.keyHash,
      set: {
        action: input.action,
        count: sql`CASE WHEN ${authRateLimits.windowStartedAt} <= ${windowStart.toISOString()} THEN 1 ELSE ${authRateLimits.count} + 1 END`,
        windowStartedAt: sql`CASE WHEN ${authRateLimits.windowStartedAt} <= ${windowStart.toISOString()} THEN ${now.toISOString()}::timestamp ELSE ${authRateLimits.windowStartedAt} END`,
        updatedAt: now,
      },
    })
    .returning({ count: authRateLimits.count });

  if (result.count > input.maximum) {
    throw new Error("Too many requests. Try again later.");
  }
}
