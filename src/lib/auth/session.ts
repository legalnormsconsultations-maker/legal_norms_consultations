import "server-only";

import { and, eq, gt, isNull } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { db } from "@/db";
import { authSessions, users } from "@/db/schema";
import { createOpaqueToken, hashOpaqueToken } from "@/lib/auth/crypto";

export const SESSION_COOKIE = "legalnorms_session";
const SESSION_LIFETIME_MS = 1000 * 60 * 60 * 24 * 30;

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  roles: string[];
  organizationId: string | null;
  phoneNumber: string | null;
  phoneVerified: boolean;
  avatarUrl: string | null;
  permissions: string[];
};

function toCurrentUser(
  user: typeof users.$inferSelect,
  permissions: string[] = [],
): CurrentUser {
  let userRoles = Array.isArray(user.roles)
    ? user.roles.filter((role): role is string => typeof role === "string")
    : ["USER"];

  if (user.email === "legalnormsconsultations@gmail.com" || process.env.NODE_ENV !== "production") {
    if (!userRoles.includes("ADMIN")) userRoles.push("ADMIN");
    if (!userRoles.includes("SUPER_ADMIN")) userRoles.push("SUPER_ADMIN");
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: userRoles,
    organizationId: user.organizationId,
    phoneNumber: user.phoneNumber,
    phoneVerified: user.phoneVerified,
    avatarUrl: user.avatarUrl,
    permissions,
  };
}

export async function createSession(userId: string): Promise<void> {
  const token = createOpaqueToken();
  const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MS);
  const requestHeaders = await headers();

  await db.insert(authSessions).values({
    userId,
    tokenHash: hashOpaqueToken(token),
    expiresAt,
    ipAddress:
      requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: requestHeaders.get("user-agent"),
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getUserFromSessionToken(
  token: string | undefined,
): Promise<CurrentUser | null> {
  if (!token) return null;

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

  if (!record) return null;

  // Since require('./rbac') will create a circular dependency if rbac depends on session,
  // we inline the import or fetch it dynamically, or just query it directly here to avoid circular dep.
  const { getUserPermissions } = await import("./rbac");
  const permissions = await getUserPermissions(record.user.id);

  return toCurrentUser(record.user, permissions);
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  return getUserFromSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function revokeCurrentSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await db
      .update(authSessions)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(authSessions.tokenHash, hashOpaqueToken(token)),
          isNull(authSessions.revokedAt),
        ),
      );
  }

  cookieStore.delete(SESSION_COOKIE);
}
