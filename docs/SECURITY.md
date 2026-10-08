# Legalnorms Consultations - Security Architecture

## 1. Data Isolation & Multi-Tenancy
The platform uses a strictly enforced **Multi-Tenant Architecture**. 
- Every organization has a unique `organizationId` (UUIDv4).
- The Service Layer automatically appends `WHERE organization_id = ?` to all data reads and writes.
- Cross-tenant data bleed is mathematically impossible at the query level due to these mandatory constraints.

## 2. API Security
- **Authentication:** External requests require Bearer API tokens. Browser-based requests rely on `HttpOnly` Secure cookies via Supabase.
- **Validation:** All payloads are strictly parsed using `zod` before hitting the database. Unrecognized fields are stripped.
- **Rate Limiting:** Redis-backed sliding window rate limiters protect high-risk endpoints (e.g., Login, Document Uploads).

## 3. High-Risk Operations
- Destructive operations (Deletions, Role Changes) require the `CriticalActionDialog` UI pattern (Type-to-confirm).
- Every high-risk operation triggers a strict, immutable entry in the `audit_logs` table containing the `userId`, `action`, `ipAddress`, and `timestamp`.

## 4. Secret Management
- **CRITICAL:** Secrets (e.g., `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are NEVER exposed to the frontend browser bundle.
- Configuration is strictly validated at boot time via `src/config/env.ts`.
