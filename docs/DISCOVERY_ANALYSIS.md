# Phase 1: Discovery & Analysis

Based on the 65 strict System Requirements codified during the architecture phase, the following is a comprehensive categorization of the platform's requirements and the documented engineering assumptions required to proceed with development seamlessly.

---

## 1. Requirement Categorization

### Functional Requirements
- **Core Entities:** Management of Drugs, Manufacturers, Regulatory Authorities, Documents, Research Articles, and Medical Portfolios.
- **Search & Discovery:** Robust, URL-driven filtering and search interface for regulatory intelligence.
- **Progressive UI:** Strict 5-tier progressive disclosure for complex medical data (Summary -> Source).
- **Workflows:** Regulatory Event creation, Document uploads, and Data ingestion.
- **Alerts:** Provider-agnostic notification system for following drugs/entities.
- **Admin Console:** Telemetry, audit log viewing, and permissions management.

### Non-Functional Requirements (NFRs)
- **UX/Design:** High-tech, premium Medical Technology aesthetic (no generic CRUD templates).
- **Mobile Equality:** Seamless responsive degradation of data-heavy tables into cards.
- **Code Quality:** Strict SOLID principles, Modular Monolith architecture, no `any` types.
- **SEO:** Automated Canonical URLs, OpenGraph tags, and strict `robots.txt` enforcement.
- **I18n:** Zero hardcoded strings in business logic; JSON dictionary routing.

### Security Requirements
- **RBAC & Isolation:** Multi-tenant organization isolation and granular permission verification at the Service layer.
- **Dangerous Actions:** "Type-to-confirm" dialogs for deletions/publishing, backed by immutable audit logs.
- **API Boundary:** Zod-validated headers, Bearer token rotation, and strict Node.js secret isolation.
- **Data Safety:** Physical composite unique indexes in Postgres to prevent ingestion race conditions.

### Performance Requirements
- **Budgets:** Fast initial page loads, minimal client JavaScript, aggressive edge caching.
- **Architecture:** Next.js App Router Server Components utilized by default to strip JS weight.
- **Background Tasks:** Synchronous blocking tasks (e.g., PDF OCR, fan-out emails) offloaded to Async Queues.

### Scalability Requirements
- **Roadmap:** Staged 5-tier approach preventing premature microservices.
- **Stage 1 (Current):** Monolith + Postgres + CDN + Redis.
- **Future Extraction Paths:** Search indexing, Ingestion, and Notification Fan-out cleanly separated into modular domains for eventual extraction.

---

## 2. Documented Engineering Assumptions

To maintain development velocity without stopping to ask trivial questions, I am making the following reasonable engineering assumptions. If any of these violate the business vision, they can be swapped out due to our strict `interface`/adapter architecture.

1. **Authentication Provider:** Assuming **Supabase Auth** is the primary identity provider, as the `package.json` already contains `@supabase/ssr`.
2. **Database ORM:** Assuming **Drizzle ORM** communicating with Postgres, as configured in the project schemas.
3. **Queue Provider:** Assuming a lightweight Redis queue (like BullMQ) or Vercel/Upstash Serverless queues will back the `NotificationService` initially.
4. **Email Provider:** Assuming an API-based provider like Resend, SendGrid, or AWS SES. Our `env.ts` requires `EMAIL_PROVIDER_KEY`.
5. **UI Styling:** Assuming **Tailwind CSS v4** coupled with **shadcn/ui** and **Base UI**, given their presence in `package.json`. The design system will override defaults to achieve the "Premium MedTech" aesthetic.
6. **Search Engine (Future):** Assuming Algolia or ElasticSearch will be the Stage 2 search provider, but initial Stage 1 MVP searches will rely on Postgres Full-Text Search (using `.ilike()` or `to_tsvector`).
7. **Storage:** Assuming AWS S3 (or an S3-compatible API like Cloudflare R2 / Supabase Storage) given the `STORAGE_` env variables in `env.ts`.
8. **Deployment Host:** Assuming Vercel, AWS Amplify, or a standard Docker/Linux environment capable of running the `.next/standalone` output.
