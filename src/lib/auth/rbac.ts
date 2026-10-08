import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
  rbacPermissions,
  rbacRolePermissions,
  rbacRoles,
  rbacUserRoles,
} from "@/db/schema";
import type { CurrentUser } from "./session";

/**
 * Enterprise-grade Role-Based Access Control (RBAC) System
 * Defines standard permissions and provides authorization helpers.
 */

export const PERMISSIONS = {
  // Admin / Platform
  VIEW_ADMIN_DASHBOARD: "view:admin_dashboard",
  MANAGE_USERS: "manage:users",
  MANAGE_ROLES: "manage:roles",
  VIEW_AUDIT_LOGS: "view:audit_logs",

  // Regulatory Data
  MANAGE_DRUGS: "manage:drugs",
  MANAGE_REGULATORY_RECORDS: "manage:regulatory_records",
  MANAGE_MANUFACTURERS: "manage:manufacturers",

  // Documents
  UPLOAD_DOCUMENTS: "upload:documents",
  DELETE_DOCUMENTS: "delete:documents",
  VIEW_RESTRICTED_DOCUMENTS: "view:restricted_documents",

  // Portfolio
  MANAGE_PORTFOLIO: "manage:portfolio",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Fetches all highly granular permissions for a given user based on their assigned roles.
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const results = await db
    .select({ permission: rbacPermissions.name })
    .from(rbacUserRoles)
    .innerJoin(
      rbacRolePermissions,
      eq(rbacUserRoles.roleId, rbacRolePermissions.roleId),
    )
    .innerJoin(
      rbacPermissions,
      eq(rbacRolePermissions.permissionId, rbacPermissions.id),
    )
    .where(eq(rbacUserRoles.userId, userId));

  return Array.from(new Set(results.map((r) => r.permission)));
}

/**
 * Checks if a user has a specific granular permission.
 * Assumes the user object has been hydrated with permissions.
 */
export function hasPermission(
  user: CurrentUser | null,
  permission: Permission,
): boolean {
  if (!user) return false;
  // If we still use the legacy JSON roles, grant super admin full access
  if (
    user.roles.includes("PLATFORM_ADMIN") ||
    user.roles.includes("SUPER_ADMIN")
  )
    return true;

  return user.permissions?.includes(permission) ?? false;
}

/**
 * Checks if a user has a specific role (Legacy / High-level check).
 */
export function hasRole(user: CurrentUser | null, role: string): boolean {
  if (!user) return false;
  return user.roles.includes(role);
}

/**
 * Enforces a permission check in Server Actions or API routes.
 * Throws an error if the user lacks the permission.
 */
export function requirePermission(
  user: CurrentUser | null,
  permission: Permission,
) {
  if (!user) {
    throw new Error("Unauthorized: Authentication required.");
  }
  if (!hasPermission(user, permission)) {
    throw new Error(`Forbidden: Missing required permission [${permission}]`);
  }
}

/**
 * Enforces a permission check for page routes. Redirects to a fallback (or dashboard) if forbidden.
 */
export function requirePagePermission(
  user: CurrentUser | null,
  permission: Permission,
  fallback = "/admin/dashboard",
) {
  if (!user) {
    redirect("/login");
  }
  if (!hasPermission(user, permission)) {
    redirect(fallback);
  }
}
