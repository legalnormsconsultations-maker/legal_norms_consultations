import { headers } from "next/headers";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import type { CurrentUser } from "@/lib/auth/session";

/**
 * Enterprise Audit Logging System
 * Ensures append-only, immutable records of all state changes for compliance (e.g. 21 CFR Part 11).
 */

export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "ACCESS"
  | "LOGIN"
  | "LOGOUT"
  | "EXPORT";

export interface AuditContext {
  user?: CurrentUser | null;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditLogEntry {
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  beforeState?: Record<string, any> | null;
  afterState?: Record<string, any> | null;
  details?: Record<string, any> | null;
}

/**
 * Automatically extracts IP and User Agent from request headers
 */
export async function getAuditContextFromRequest(): Promise<
  Partial<AuditContext>
> {
  try {
    const requestHeaders = await headers();
    return {
      ipAddress:
        requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        undefined,
      userAgent: requestHeaders.get("user-agent") || undefined,
      requestId: requestHeaders.get("x-request-id") || `req-${Date.now()}`,
    };
  } catch (error) {
    // If not called within a request context, safely return empty
    return {
      requestId: `sys-${Date.now()}`,
    };
  }
}

/**
 * Records an append-only audit event in the database.
 */
export async function logAuditEvent(
  entry: AuditLogEntry,
  context: AuditContext = {},
) {
  // Merge automatic context if missing
  if (!context.ipAddress || !context.userAgent) {
    const reqContext = await getAuditContextFromRequest();
    context = { ...reqContext, ...context };
  }

  await db.insert(auditLogs).values({
    userId: context.user?.id,
    organizationId: context.user?.organizationId,
    action: entry.action,
    resourceType: entry.resourceType,
    resourceId: entry.resourceId,
    requestId: context.requestId,
    beforeState: entry.beforeState ?? null,
    afterState: entry.afterState ?? null,
    details: entry.details ?? null,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
  });
}
