# Legalnorms Consultations - Deployment Architecture

## 1. Infrastructure Overview
The application is deployed as an immutable Next.js container/serverless deployment. 

## 2. CI/CD Pipeline
Deployment is fully automated via GitHub Actions (`.github/workflows/ci.yml`). 
No manual code changes on production servers are allowed.

**Pipeline Stages:**
1. **Lint & Format:** `pnpm biome check .`
2. **Typecheck:** `pnpm tsc --noEmit`
3. **Test:** `pnpm vitest run`
4. **Build:** `pnpm build`
5. **Deploy:** Artifacts are pushed to Vercel/AWS.

## 3. Zero-Downtime Database Migrations
- Executed exclusively via Drizzle ORM.
- The pipeline runs `pnpm db:migrate` before the new application containers accept traffic.
- **Rule:** Breaking schema changes (e.g., renaming a column) must be done in two backwards-compatible phases to prevent dropping active connections.
