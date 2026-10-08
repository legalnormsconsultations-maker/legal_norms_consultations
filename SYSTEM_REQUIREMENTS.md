# Legalnorms consultations - Medical Drug Regulatory & Medical Portfolio Platform - System Requirements

## Core Philosophy
This document serves as the foundational architectural and behavioral guide for the platform. It must be read prior to commencing any development task.
- **No Toy Features**: Every feature implemented must be production-ready, fully operational, and scalable.
- **Enterprise Grade**: Designed for high availability, massive scale (billion-user path), and robust security.
- **Regulatory Compliance**: Must incorporate principles of healthcare regulatory compliance (e.g., audit trails, secure data handling).

## Technical Architecture

### 1. Frontend Infrastructure (Client & SSR)
- **Framework**: Next.js (App Router) for Server-Side Rendering (SSR) and optimized delivery.
- **Styling**: Tailwind CSS v4 for utility-first, scalable styling with a modern, high-tech interface.
- **State Management**: React 19 paradigms (Server Components, Server Actions) coupled with Context/Zustand where global client state is strictly necessary.
- **UX/Animations**: Framer Motion for premium, smooth micro-interactions that feel responsive and "alive" without sacrificing performance.
- **Components**: Accessible, enterprise-grade component library (e.g., Radix UI / custom tailored components).

### 2. Backend Infrastructure & APIs
- **API Paradigm**: Next.js Server Actions for tight data coupling and secure server-side execution. RESTful API routes where external integrations are necessary.
- **Data Validation**: Zod for end-to-end type safety and strict schema validation on all inputs.
- **Authentication & Authorization**: Enterprise-grade auth (e.g., Auth.js / NextAuth or a managed service like Supabase/Clerk) with robust Role-Based Access Control (RBAC) (e.g., Admin, Regulatory Officer, Portfolio Manager, Guest).

### 3. Data Infrastructure (Scalable & Distributed)
- **Primary Database**: PostgreSQL (via scalable providers like Neon, Supabase, or AWS RDS).
- **ORM/Query Builder**: Drizzle ORM or Prisma for type-safe database interactions and schema migrations.
- **File Storage**: Object storage (AWS S3 or equivalent) for secure document uploads (PDFs, regulatory filings) with signed URLs for access.
- **Caching & Rate Limiting**: Redis for session management, API rate limiting, and aggressive caching of high-read/low-write regulatory data.

### 4. Security & Regulatory Compliance
- **Data Encryption**: TLS for data in transit; AES-256 for data at rest.
- **Audit Logging**: Immutable audit logs for all CRUD operations on regulatory documents and portfolio items.
- **Compliance Considerations**: HIPAA/GDPR readiness (data masking, secure backups, user data deletion flows).

### 5. DevOps & Code Quality
- **Tooling**: Biome for fast linting/formatting. TypeScript (Strict Mode) across the entire stack.
- **CI/CD**: Automated testing (Unit + E2E), preview environments, and robust deployment pipelines.

## Feature Roadmap (V1 Production Grade)
1. **Secure Auth & RBAC System**: Multi-tenant or multi-role environment.
2. **Regulatory Submissions Hub**: End-to-end flow for submitting, reviewing, and approving drug regulatory documents.
3. **Medical Portfolio Dashboard**: Real-time analytics and tracking of medical products/trials.
4. **Immutable Audit Trail**: System-wide logging of all critical actions.
5. **Secure Document Management**: Upload, encrypt, and manage compliance documents.

*Whenever working on this project, ensure that code meets the standard of a high-tech, highly scalable, and secure enterprise application.*

## Core Technology Requirements
1. **Next.js & React**: Use the latest stable versions, strictly adhering to the App Router architecture. Avoid deprecated APIs.
2. **Server/Client Components**: Maximize the use of Server Components for data fetching and performance. Client Components (`"use client"`) should only be used where interactivity (hooks, state, browser APIs) is required.
3. **TypeScript**: Strict TypeScript mode must be utilized. No `any` types unless absolutely necessary.
4. **Package Manager**: Exclusively use `pnpm`. Do NOT use `npm` or `yarn`.
5. **Formatting & Linting**: Use `Biome` consistently for code formatting, linting, import organization, and quality checks.
6. **Architecture**: Maintain a clean, modular architecture with production-oriented error handling and automated validation/testing considerations.
7. **Security**: Environment variables must be used for secrets and configuration.

## Product Vision
Build a platform that combines:
- **Medical Drug Regulatory Information**
- **Drug / Medicine Portfolio Management**
- **Regulatory Document Management**
- **Pharmaceutical / Manufacturer Profiles**
- **Drug Approval & Regulatory Intelligence**
- **Medical Research and Portfolio Presentation**
- **Search and Discovery**
- **Analytics and Dashboards**
- **Role-based Administration**
- **Secure User Accounts**
- **Audit and Compliance Infrastructure**
- **Public-facing informational pages**
- **Enterprise-ready API architecture**

The interface must feel premium, modern, trustworthy, technically advanced, and extremely organized. It should feel like a combination of a modern healthcare technology platform, pharmaceutical intelligence platform, professional medical portfolio, regulatory data portal, and enterprise SaaS application.

## 3. Important Medical Safety Boundary
This platform is a regulatory and informational technology system. 

**Do NOT position it as a substitute for:**
- Doctors
- Pharmacists
- Regulators
- Clinical diagnosis
- Medical emergency services

**Do NOT automatically provide personalized treatment recommendations.**

**Clearly separate:**
- Factual regulatory information
- Scientific information
- Portfolio information
- Educational content
- User-generated information

*Where appropriate, include professional disclaimers and source attribution.*

## 4. Design Language
Create a highly modern, high-tech medical interface with the following characteristics:
- Premium, clean, and futuristic
- Trustworthy and minimal but information-rich
- Excellent typography with sophisticated spacing
- Strong information hierarchy
- Responsive, accessible, and comfortable for long reading sessions
- Optimized for desktop, tablet, and mobile

**Avoid the following at all costs:**
- Childish design
- Excessive gradients and unnecessary animations
- Excessive glassmorphism
- Cluttered dashboards and giant meaningless hero sections
- Poor contrast and excessive rounded cards
- Generic template appearance

*The final product must look custom-designed rather than generated from a generic SaaS template.*

## 5. Color System
Create a professional medical technology design system using:
- Neutral base surfaces
- Sophisticated healthcare-oriented accent colors
- Highly readable text
- Clear status colors
- Subtle borders
- Accessible contrast

**Implementation Rules:**
- Do not hardcode colors throughout the application.
- Create a centralized design-token system.
- Ensure the system supports future dark mode, light mode, and user preference persistence.

## 6. Typography
Use a professional modern typeface system. The typography must remain highly readable for medical documents, drug information, regulatory records, scientific content, and dense dashboards.

**Required Typographic Definitions:**
- Display typography
- Page headings
- Section headings
- Body text
- Labels
- Metadata
- Table text
- Dashboard metrics
- Helper text

## 7. Information Architecture
The platform requires a clear, hierarchical global navigation system. To prevent cognitive overload and maintain a premium interface, the architecture uses logical grouping rather than a flat list.

### Primary Navigation (Public)
- **Home** (Logo)
- **Intelligence** (Dropdown: Drug Database, Manufacturers, Regulatory Intelligence, Regulatory Documents)
- **Portfolio** (Dropdown: Medicines, Medical Research)
- **Resources** (Dropdown: Analytics, News & Updates)
- **Company** (Dropdown: About, Contact)

### Authenticated Navigation (User Dashboard Sidebar)
- **Overview**: Dashboard, Alerts & Notifications
- **Workspace**: My Portfolio, Saved Drugs, Saved Documents, Reports
- **Settings**: Account Profile, Preferences

### Admin Navigation (Secure Admin Panel)
- **Overview**: Admin Dashboard, System Health, Audit Logs
- **Access Control**: Users, Roles & Permissions
- **Data Management**: Drugs Catalog, Regulatory Records, Manufacturers, Documents, Content
- **System Configuration**: API Management, Security Settings, System Configuration

## 8. Homepage
The homepage must immediately communicate what the platform does, who it serves, what information is available, and why it exists.

**Hero Section Requirements:**
- Strong headline (e.g., "Drug Regulatory Intelligence, Medical Data & Portfolio Management in One Platform")
- Concise description
- Primary CTA & Secondary CTA
- Global search capability

**Modular Below-the-Hero Sections:**
1. Global drug search
2. Regulatory intelligence
3. Featured medicines
4. Featured manufacturers
5. Regulatory updates
6. Medical portfolio highlights
7. Research/knowledge section
8. Platform statistics
9. Trust/security section
10. Final CTA

## 9. Global Search
Search must become a core part of the platform. The system must be designed so the search layer can later scale independently and integrate with a dedicated search engine (e.g., Elasticsearch, Algolia, Typesense) if database-native search is no longer sufficient.

**Supported Search Entities:**
- Drug names, generic names, and brand names
- Active ingredients and therapeutic categories
- Manufacturers and regulatory identifiers
- Indications and approval status
- Regulatory documents and scientific references

**Required Search Features:**
- Global search bar available throughout the app
- Predictive autocomplete with debouncing
- Recent searches and popular searches
- Advanced search interfaces
- Filtering, sorting, and faceted navigation
- Pagination / cursor pagination

## 10. Drug Database Module
The platform must feature a professional drug information system containing structured, highly relational profiles. All regulatory data must be accurate; where real data is unavailable, use clearly labeled mock/demo data.

**Required Profile Domains:**
1. **Identity:** Drug name, generic name, brand names, active ingredients, molecular information, dosage forms, strengths, route of administration, and therapeutic categories.
2. **Regulatory Information:** Approval status, regulatory authority, approval date, application/reference identifiers, regulatory pathway, market status, jurisdictions, warnings, restrictions, and regulatory history.
3. **Manufacturer:** Manufacturer name, company profile, country, and manufacturing sites.
4. **Documentation:** Labels, assessment reports, public regulatory documents, safety information, and references.
5. **Scientific Information:** Mechanism of action, pharmacological class, research references, and clinical evidence references (where legally/publicly available).

## 11. Drug Detail Page UX
The drug profile page must be one of the most polished pages in the system, designed to handle extreme data density without overwhelming the user.

**Page Structure:**
- **Header:** Drug name, status badge, key identifiers, manufacturer link, and save/share actions.
- **Content Sections:**
  1. Overview
  2. Regulatory Status & Timeline
  3. Active Ingredients & Dosage / Form
  4. Manufacturer Details
  5. Clinical / Scientific Information
  6. Safety / Warnings
  7. Documents & References
  8. Related Medicines & Regulatory History
  9. Audit / Source Metadata

**UX Requirements:**
- Use a structured section system (e.g., continuous scroll with anchors) or tabs without making information difficult to access.
- On large screens, implement a **sticky contextual navigation panel** (table of contents) so users can jump quickly between dense medical sections.

## 12. Regulatory Intelligence
Create a dedicated regulatory intelligence tracking system. It must provide a timeline-based interface representing the lifecycle of drug regulatory actions.

**Supported Events:**
- Approval events and regulatory decisions
- Status changes and jurisdiction changes
- Safety updates and warnings
- Document publication and labeling updates
- Regulatory milestones (Development -> Submission -> Review -> Approval -> Post-Market -> Safety Update -> Label Revision)

**Event Data Structure Requirements:**
Each intelligence event must support:
- Timestamp of the event
- Jurisdiction (e.g., US, EU)
- Authority (e.g., FDA, EMA)
- Source attribution
- Document linking
- Structured metadata payloads

## 13. Multi-Jurisdiction Architecture
The platform data model must allow multiple regulatory authorities to coexist natively without being hardcoded around a single authority (like the FDA). 

**Supported Authorities (Examples):**
- FDA (United States)
- EMA (European Union)
- MHRA (United Kingdom)
- CDSCO (India)
- PMDA (Japan)
- TGA (Australia)
- Health Canada

**Required Extensible Entities:**
The database must feature dedicated extensible tables for:
- RegulatoryAuthority
- Jurisdiction
- RegulatoryApplication
- Approval
- RegulatoryEvent
- RegulatoryDocument
- SafetyUpdate

## 14. Manufacturer / Pharmaceutical Company Profiles
The system must include detailed manufacturer pages acting as clean company profile dashboards.

**Supported Profile Attributes:**
- Company overview & logo
- Headquarters and country of registration
- Corporate website
- Product portfolio (Associated medicines)
- Regulatory history and timeline
- Public documents and filings
- Manufacturing information (where appropriate/public)
- Research information and related news

## 15. Medical Portfolio Module
The system must include a highly professional Medical Portfolio Module designed for medical/pharmaceutical professionals and organizations.

**Portfolio Profile Entities:**
- Professional profile, expertise, and medical interests
- Research, publications, and projects
- Certifications, achievements, and organizations
- Portfolio items, presentations, and documents

**Portfolio Layout Requirements:**
- Profile header with professional summary
- Expertise cards
- Projects, research, and publications sections
- Professional timeline
- Document library
- Achievements and certifications tracker

## 16. Research Module
Create a structured research area for scientific knowledge. **Never invent scientific citations.** 

**Supported Research Entities:**
- Research articles and publications
- Scientific references and external references
- Research categories
- Authors and organizations
- Publication dates

**Citation & Metadata Requirements:**
- Must include strict citation information.
- Must include source metadata.
- Must include publication URLs where available.

## 17. Document Management System
The platform must feature a robust and secure document management system. Large files must never be stored directly inside relational database rows; they must use an object storage architecture.

**Supported Document Types:**
- Regulatory reports, approval documents, and public assessment reports
- Labels and safety documents
- Scientific documents and company documents
- Portfolio documents

**Document Features:**
- Secure storage with versioning and document status tracking
- Strict metadata tracking (type, publication date, source)
- Relational mapping to jurisdictions, linked drugs, and linked manufacturers

## 18. File Storage Architecture
The platform requires a storage layer abstraction capable of interacting with standard S3-compatible object storage providers (e.g., Amazon S3, Cloudflare R2).

**Storage Features & Security:**
- Support for generating signed URLs for private files
- Support for public files where legally/architecturally appropriate
- Database-backed file metadata tracking
- Storage lifecycle policies
- Antivirus and security scanning integration points
- Upload size limits and checksum verification
- **CRITICAL RULE:** Never trust file extensions alone. Enforce strict MIME type validation.

## 19. User Authentication
Build an enterprise-grade authentication architecture designed so the underlying authentication provider can be replaced seamlessly if needed.

**Required Features:**
- Registration, login, and secure logout
- Email verification and password reset flows
- Secure session management (e.g., secure, HTTP-only cookies)
- Account recovery and optional Multi-Factor Authentication (MFA)
- OAuth provider abstraction

**Security Constraints:**
- **CRITICAL RULE:** Never store raw passwords.
- Enforce secure password hashing.
- Follow industry-standard session and cookie security practices.

## 20. Role-Based Access Control (RBAC)
Implement an enterprise-grade Role-Based Access Control system to manage granular permissions securely.

**Supported Roles Include:**
- Public User, Registered User
- Medical Professional, Researcher
- Organization Member, Organization Admin
- Content Editor, Regulatory Data Manager
- Moderator
- Platform Admin, Security Admin, Super Admin

**Security Constraints:**
- Permissions must be highly granular.
- **CRITICAL RULE:** Do not rely only on hiding frontend buttons. Every protected action must be authorized server-side.

## 21. Organization / Multi-Tenant Support
Design the core architecture to support future enterprise organizations and B2B workflows natively. Users must be able to belong to one or more organizations.

**Required Tenant Entities:**
- Organization
- OrganizationMember
- OrganizationRole
- OrganizationPermission

**Multi-Tenancy Architecture Rules:**
- Tenant isolation must be strictly considered at the database, API, and authorization layers.
- Do not design the system in a way that makes future multi-tenancy extremely difficult.
- Queries involving user-generated content must explicitly scope to the appropriate tenant context.

## 22. Database Architecture
Use a PostgreSQL-compatible relational database architecture optimized for strong relational integrity, indexing, transactions, constraints, auditability, migrations, partitioning, and high read/write throughput.

**Core Entities Include:**
users, profiles, organizations, organization_members, roles, permissions, drugs, drug_aliases, ingredients, drug_forms, manufacturers, manufacturer_sites, regulatory_authorities, jurisdictions, regulatory_applications, regulatory_events, approvals, regulatory_documents, document_versions, research_articles, authors, citations, portfolio_items, saved_items, alerts, notifications, tags, categories, audit_logs, api_keys, sessions, security_events.

**Database Design Rules:**
- Normalize where useful, but do not over-normalize hot read paths.
- **CRITICAL RULE:** Use stable IDs (e.g., UUIDv4/CUID).
- Avoid fragile database-generated assumptions (like auto-incrementing sequences) that make distributed systems difficult to evolve or migrate.

## 23. Database Scalability
Do NOT claim that a single PostgreSQL instance can magically handle unlimited traffic. Design for horizontal scalability from day one.

**Scalability Architecture Paths:**
- Read replicas and connection pooling
- Partitioning (especially for hot tables)
- Archival and caching strategies
- Query optimization and database splitting by workload
- Sharding strategy when justified
- Separate search infrastructure (decoupled from the core database)
- Event-driven workloads

**Specific Table Constraints:**
- High-volume tables (e.g., `audit_logs`, `regulatory_events`) must be highly scalable and explicitly designed with time-series or tenant-based partitioning in mind.

## 24. Database Access Layer
Use a strongly typed database access architecture powered by a modern TypeScript-compatible ORM (e.g., Drizzle ORM). 

**Layered Architecture Constraints:**
Database operations must be strictly separated from the UI, Route Handlers, and core Business Logic. Adhere to the following flow:
`UI` → `Server Actions / API` → `Service Layer` → `Repository / Data Access Layer` → `Database`

**CRITICAL RULE:** Avoid putting large amounts of business logic directly inside React components.

## 25. Migrations
Database schema changes must be rigidly version-controlled using migrations.

**Migration Architecture:**
- Must use a declarative migration workflow (e.g., Drizzle Migrations).
- Strict separation of environments: Development database, Staging database, Production database.
- Production migration process must be automated and rollback-aware.
- Maintain clear migration documentation for onboarding.
- **CRITICAL RULE:** Never require manually editing production database structures. All changes must be deployed via code.

## 26. API Architecture
Design the backend API as a versioned architecture (e.g., `/api/v1/...`) with carefully constructed API contracts.

**Required API Features:**
- RESTful endpoints where appropriate
- Strongly typed request/response validation
- Standardized, predictable error responses
- Required authentication and RBAC authorization
- Rate limiting and traceability (Request IDs)
- Offset pagination and cursor pagination for large datasets

**Asynchronous Capabilities:**
- Where useful, the API must support webhooks, event-driven processing, and asynchronous background jobs.

## 27. Billion-User Scale Architecture
Treating billion-user support as an infrastructure and architecture problem rather than a single application-server problem.

**Application Layer Requirements:**
- Must be strictly stateless.
- Horizontally scalable and container-friendly.
- Independently deployable where practical.
- **CRITICAL RULE:** Never depend on local filesystem persistence for critical production data.
- Design the application so additional instances can be spun up without relying on local server memory state.

**Required Infrastructure Layers:**
1. Global CDN
2. Edge / WAF (Web Application Firewall)
3. Load Balancer
4. Application Instances (Next.js / Node)
5. Caching Layer (e.g., Redis)
6. Service Layer
7. Database / Read Replicas (PostgreSQL)
8. Search Infrastructure (Dedicated)
9. Object Storage (S3/R2)
10. Async Job Infrastructure

## 28. Caching Strategy
Implement a multi-level caching strategy to maximize throughput and minimize database load.

**Caching Layers:**
- CDN Caching (Edge)
- Browser Caching (Cache-Control headers)
- Next.js Caching (Data Cache, Full Route Cache, Router Cache)
- Server-Side Caching (Redis-compatible memory store)
- Database Query Optimization (Materialized views, query caching)

**Target Content for Caching:**
- Public drug pages and public manufacturer pages
- Taxonomies and standardized terminologies
- Frequently requested public regulatory information

**CRITICAL RULES:** 
- Do not blindly cache private, authenticated, or security-sensitive data.
- An explicit invalidation strategy (e.g., tag-based revalidation, Webhook triggers) must be defined for all cached layers to prevent stale regulatory data.

## 29. Asynchronous Processing
Long-running workloads must never block the synchronous HTTP request path.

**Queue-Compatible Job Architecture required for:**
- Document processing and file scanning (Antivirus/MIME validation)
- Bulk data imports
- Regulatory data synchronization
- Search indexing
- Notifications and email delivery
- Analytics aggregation and report generation

**Constraints:**
- The application request path must remain fast (sub-200ms). Heavy lifting is strictly delegated to the background queue.

## 30. Regulatory Data Ingestion
Design a robust data ingestion pipeline to process information from public regulatory APIs, public datasets, and officially published documents.

**Pipeline Flow:**
`Source` → `Fetcher` → `Validation` → `Normalization` → `Deduplication` → `Transformation` → `Database` → `Search Index` → `Audit Log`

**Data Integrity Constraints:**
Every imported dataset or record must strictly retain:
- Source origin
- Retrieval timestamp
- Version
- External identifier
- Transformation history (where necessary)

**CRITICAL RULE:** Never silently overwrite important regulatory history. Data changes should ideally be append-only or versioned, emitting a regulatory event to track the modification.

## 31. Data Versioning
Regulatory information is extremely time-sensitive. The architecture must natively support temporal logic and versioning.

**Required Temporal Capabilities:**
- Effective dates vs Publication dates
- Source version tracking
- Status history (event-sourcing approach)
- Document version control

**User Experience:**
- End-users must always be able to easily distinguish between currently active regulatory information and deprecated/historical records.

## 32. Audit System
Build a comprehensive, append-oriented audit system.

**Required Audit Events:**
- Authentication (login, logout, failed login, password changes)
- Security (permission changes, API key actions, security events)
- Data Mutation (drug record changes, regulatory data changes)
- Storage (document uploads, document deletions)
- Administrative actions

**Audit Record Payload:**
Every log must capture the following metadata (where available and legally appropriate):
- Actor (User ID) and Organization
- Action verb and Resource Type
- Resource ID and Request ID
- Timestamp
- IP metadata and User Agent
- Before/After change summary (JSON payload) when appropriate

## 33. Security
Security is a first-class architectural requirement. 

**Vulnerability Protections Required:**
The platform must implement explicit protections against:
- SQL Injection (Enforced via parameterized ORM queries)
- XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery)
- SSRF (Server-Side Request Forgery)
- Broken Access Control and IDOR (Insecure Direct Object Reference)
- Credential Stuffing and Brute Force Attacks
- Malicious File Uploads (Strict MIME validation and Antivirus scanning)
- API and Rate Abuse
- Session Theft

**Security Posture & Enforcement:**
- Strict Content Security Policy (CSP) and Secure HTTP Headers.
- Uncompromising Input Validation (Zod) and Output Encoding.
- Least-privilege access enforced strictly at the Server Action/API layer.
- Secret Management (e.g., Doppler, AWS Secrets Manager).
- **CRITICAL RULE:** Never expose secrets, API keys, or raw passwords to the client.

## 34. Healthcare & Privacy Architecture
Do not assume that the platform is automatically compliant with any healthcare regulation (e.g., HIPAA, GDPR, CCPA).

**Data Separation Architecture:**
Design a privacy-conscious architecture with explicit isolation between:
- Public regulatory information (e.g., public APIs, FDA datasets)
- Account data (e.g., user profiles, login credentials)
- Organization data (Multi-tenant isolated records)
- Private documents (Portfolios, proprietary company IP)
- Sensitive information (Security tokens, API keys)

**PHI / Regulated Data Policy:**
- Avoid collecting Patient Health Information (PHI) unless explicitly required by a core feature.
- **CRITICAL RULE:** If future requirements introduce PHI or other highly regulated healthcare data, a dedicated compliance assessment must be conducted and approved *before* implementation begins.

## 35. Accessibility
Target strong accessibility out-of-the-box by following WCAG-oriented development principles.

**Core Accessibility Standards:**
- Must use Semantic HTML for all structures.
- Strict support for keyboard navigation (e.g., skip-to-content links, logical tab order).
- Clear, highly visible focus states for all interactive elements.
- Screen reader compatibility (proper ARIA roles, `aria-hidden` when appropriate).
- Sufficient color contrast ratios (targeting WCAG AA/AAA).
- Respect user preferences for `prefers-reduced-motion`.

**Component-Specific Requirements:**
- **Forms:** Must have proper, programmatically associated `<label>` elements and accessible validation error announcements.
- **Tables:** Must use proper `<th>`, `scope`, and `<caption>` structures.
- **Dialogs/Modals:** Must trap focus, return focus on close, and support the Escape key.

## 37. Dashboard
Create a premium, authenticated data dashboard serving as the central hub for users.

**Dashboard Content Requirements:**
The dashboard must aggregate and present:
- High-level overview metrics
- Recently updated drugs and fast-tracked regulatory events
- Saved items and personalized alerts
- Document activity and file scanning statuses
- Portfolio summary and professional credentials
- System notifications

**Data Visualization Rules:**
- Charts and graphs must communicate actionable, highly useful information.
- **CRITICAL RULE:** Avoid purely decorative charts. If a chart does not assist in regulatory or portfolio decision-making, use a data table or summary metric instead.

## 38. Admin Dashboard
Build a dedicated Admin Dashboard to monitor platform health and regulatory synchronization.

**Required Admin Capabilities:**
- Platform metrics and active users
- API traffic, rate limiting, and failed requests
- Regulatory data updates and ingestion pipeline status
- Object storage usage and document scanning queues
- Background job queue status (from Section 29)
- System alerts, security events, and audit activity

**CRITICAL RULE:** Admin pages must be strictly permission-protected via the RBAC layer, accessible only to authenticated Super Admins or Platform Admins.

## 39. Search Result UX
The search experience is a primary navigation mechanism. It must support high-density, metadata-rich results.

**Search Result Requirements:**
Cards or rows in the search result must immediately display:
- Exact match relevance and Entity Type (e.g., Drug, Authority, Document)
- Status, Jurisdiction, and Manufacturer
- Key metadata (e.g., Application number, phase)

**Search Filters & Navigation:**
- **Filters:** Entity type, Jurisdiction, Regulatory authority, Status, Manufacturer, Therapeutic class, Date range.
- **Support:** Sorting, Pagination, Saved Searches.
- **CRITICAL RULE:** Filters must be strictly driven by URL query parameters to ensure search pages are universally URL-shareable and bookmarkable.

## 40. Notification & Alert System
Users must be able to "follow" or subscribe to entities across the platform to receive proactive alerts.

**Followable Entities:**
- Drugs and Biologics
- Manufacturers
- Regulatory Authorities
- Therapeutic Categories

**Notification Triggers:**
The system must generate alerts for:
- Regulatory updates and approval events
- Safety updates and box warnings
- New document publications
- Portfolio updates

**Architecture Constraints:**
- Must support multiple notification channels (e.g., In-App, Email, Push) through a strict, provider-agnostic abstraction layer.

## 41. Performance Engineering
Performance must be treated as a primary requirement and engineered proactively, not as an afterthought.

**Performance Targets:**
- Fast initial page loads (TTFB) and minimal layout shift (CLS).
- Small client JavaScript payloads.
- Server-side rendering (RSC) and Streaming where useful.
- Optimized images and lazy loading for off-screen assets.
- Highly efficient, indexed database queries.
- CDN delivery for static assets and edge caching.

**Performance Budgets & Strict Restrictions:**
To maintain a high-performance profile, the following are strictly prohibited or restricted:
- **Avoid unnecessary `"use client"` components.** Default to React Server Components (RSC).
- **Avoid unnecessary `useEffect` hooks.** Prefer data fetching on the server.
- **Avoid large global state managers** (e.g., Redux) unless strictly required for complex client interactions.
- **Avoid large dependency packages.** Use built-in APIs (like `Intl.DateTimeFormat` over `moment.js`).

## 42. Observability
Production observability must be baked natively into the architecture.

**Core Tracking Requirements:**
The system must actively track and monitor:
- Errors and overall throughput.
- Latency (Client TTFB, Database queries, External API calls).
- Infrastructure Health (Database performance, Queue health, Cache hit/miss ratios).
- Audit metrics (Authentication events, Security events).

**Structured Logging & Traceability:**
- **CRITICAL RULE:** All logging must be structured (e.g., JSON).
- Every important request must be traceable end-to-end via a persistent Request ID / Correlation ID.
- The architecture must provide clear integration points for external Metrics (e.g., Datadog), Distributed Tracing (e.g., OpenTelemetry), Error Monitoring (e.g., Sentry), and Log Aggregation.

## 43. Error Handling
Create a highly robust, consistent error architecture bridging the UI and the server.

**Frontend Requirements:**
- Implement distinct visual states: Loading, Empty, and Error states.
- Provide contextual "Retry" UI capabilities.
- Build offline-aware UX where appropriate (e.g., indicating network disconnection).

**Backend Requirements:**
- Use strictly typed, structured errors encompassing Validation, Authorization, Not Found, and Internal server issues.
- **CRITICAL RULE:** Never expose sensitive internal stack traces, database queries, or server filesystem paths to the end user.

## 44. Design System
The UI must be built upon a strictly controlled, reusable Design System to ensure visual consistency and development velocity.

**Component Categories:**
- **Core:** Button, Input, Select, Checkbox, Dialog, Dropdown, Tooltip.
- **Data:** DataTable, MetricCard, Timeline, StatusBadge, FilterPanel, SearchBox.
- **Medical:** DrugCard, DrugHeader, RegulatoryTimeline, ManufacturerCard, DocumentCard, ResearchCard, PortfolioCard.
- **Layout:** Header, Sidebar, Footer, Breadcrumbs, PageHeader, Section, Tabs.

**Component API Constraints:**
- All components must expose a consistent, predictable API (e.g., standardizing `variant` and `size` props).
- Components must be strictly encapsulated—do not leak internal structural classes (Tailwind) to the consuming parent unless explicitly permitted via a `className` override.

## 45. UI States
Every core data interface must proactively manage and define a comprehensive lifecycle of visual states to guarantee a premium user experience.

**Required Visual States:**
- **Loading / Skeleton:** Prevent layout shifts while awaiting network responses.
- **Empty:** Informative, friendly feedback when zero results are found.
- **Success:** Clear visual confirmation of completed actions.
- **Error / Offline:** Handled cleanly (as per Section 43) including offline degradation.
- **Permission Denied:** Explaining RBAC failures gracefully.
- **Not Found:** 404 boundaries for missing dynamic data (e.g., a missing drug ID).
- **Stale Data:** Subtle indicators if cached data is older than the required threshold.

**CRITICAL RULE:** Do not leave interfaces unfinished. If an API call can fail or return empty, the corresponding Empty or Error state must be explicitly coded into the UI.

## 46. Page Structure & Planning
Every page must be individually and meticulously planned before a single line of implementation code is written.

**Required Page Master List (30 Minimum):**
1. Home, 2. Drug listing, 3. Drug search, 4. Drug detail, 5. Regulatory intelligence, 6. Regulatory event detail, 7. Manufacturer listing, 8. Manufacturer detail, 9. Documents, 10. Document detail, 11. Research, 12. Research detail, 13. Medical portfolio, 14. Portfolio detail, 15. User dashboard, 16. Saved items, 17. Alerts, 18. Account, 19. Settings, 20. Authentication, 21. Admin dashboard, 22. Admin users, 23. Admin drugs, 24. Admin regulatory records, 25. Admin documents, 26. Admin audit logs, 27. API documentation, 28. About, 29. Contact, 30. Legal / Privacy / Terms.

**Page Planning Contract:**
Before implementing any of the above pages, a detailed specification must be established defining:
1. Purpose & Target user
2. Information hierarchy & Components
3. Interactions & Data requirements
4. Permissions & RBAC level
5. Loading state & Error state definitions
6. Mobile behavior & SEO requirements

*Note: The comprehensive planning for all 30 pages is documented in the dedicated `PAGE_ARCHITECTURE.md` specification.*

## 47. SEO Architecture
Public regulatory pages act as top-of-funnel acquisition assets and must be highly optimized for search engines.

**Required SEO Implementations:**
- Programmatic Metadata (Title, Description) and Canonical URLs.
- Open Graph (OG) tags for social sharing.
- Structured JSON-LD Data where appropriate (e.g., Article, Dataset, MedicalEntity).
- Automated Sitemap Architecture and `robots.txt` configuration.
- Strict adherence to Semantic HTML Headings (Only one `<h1>` per page).

**Scalable URL Architecture:**
URL structures must be clean, hierarchical, and slug-based. Avoid using raw UUIDs in public-facing paths when a semantic slug is available.
- `/drugs/[slug]`
- `/manufacturers/[slug]`
- `/regulatory/[authority]/[slug]`
- `/documents/[slug]`
- `/research/[slug]`

## 48. Internationalization (i18n)
The platform must be architected from day one to support seamless future localization.

**Future Language Targets:**
- English (Default)
- Hindi
- Other International Languages as regulatory scope expands.

**Architecture Constraints:**
- **CRITICAL RULE:** Do not hardcode user-visible strings (labels, error messages, placeholders) deeply across business logic or deeply nested UI components. 
- All major UI text must be extractable or routed through a centralized translation dictionary pattern.

## 49. API Documentation
The underlying API must be designed as a scalable B2B platform product, not merely an ad-hoc collection of internal Next.js endpoints.

**Documentation Scope:**
Professional developer documentation must be maintained containing:
- Authentication flows and API Key generation/rotation.
- Comprehensive Endpoints with strict Request and Response schemas.
- Cursor Pagination standards and Rate Limiting ceilings.
- Error codes mapping (aligned with Section 43).
- Webhook payload structures and retry policies.

**Implementation Constraint:**
- An OpenAPI (Swagger) specification must be maintained as the single source of truth for the API contract.

## 50. Testing Strategy
A robust, multi-tiered testing strategy must be enforced. Meaningless tests written purely for coverage metrics are strictly prohibited.

**Required Testing Layers:**
- **Unit & Integration:** For core business logic and Service layers.
- **Database & API:** Guaranteeing schema constraints, transactions, and JSON contracts.
- **Security & Authorization:** Explicit tests ensuring RBAC and Organization isolation boundaries hold firm.
- **E2E:** Critical path flows (Login -> Search -> View Document).

**Critical Test Areas:**
The following domains require mandatory, high-confidence test suites:
- Authentication, Session Management, and Role-based Permissions.
- Multi-tenant Organization isolation (preventing cross-org data bleed).
- Drug search relevance and retrieval performance.
- Regulatory Event creation (including Audit Logging validation).
- Private Document access controls.

## 51. Code Quality & Modularity
The codebase must adhere to strict software engineering standards to maintain long-term maintainability.

**Core Principles:**
- Follow SOLID principles, strong Separation of Concerns (SoC), and DRY where appropriate.
- Enforce strictly typed interfaces (no `any`).
- Use clear, descriptive variable and function naming.
- Build small, reusable functions and modular services.
- Rely on predictable, structured error handling across the stack.

**Architectural Boundaries:**
- **CRITICAL RULE:** Avoid premature microservices. The application must be built as a **Modular Monolith**.
- While existing within a monolith, domains (e.g., Drugs vs. Users vs. Documents) must be strictly isolated into separate Services and Repositories. This ensures clean boundaries so that heavily utilized services can be seamlessly extracted into microservices in the future if billion-user scale demands it.
- Do not overengineer trivial features. Choose the simplest path that satisfies the requirements.

## 52. Master Architecture Decision
The core infrastructure philosophy of the Legalnorms platform relies on a heavily vetted, industry-standard technology stack. 

**Infrastructure Primitives:**
The platform strictly mandates the following composition:
1. **Modular Monolith:** No day-one microservices without strict justification.
2. **Stateless Application Layer:** All state must live in DB/Cache (Section 27).
3. **PostgreSQL:** Primary relational datastore (Section 1).
4. **Redis-Compatible Caching:** Ephemeral state and multi-level caching (Section 28).
5. **Object Storage:** S3-compatible blob storage for medical documents.
6. **Search Engine Integration:** Dedicated search infrastructure for high-performance retrieval.
7. **Queue / Worker Architecture:** Background processing for heavy tasks (Section 29).
8. **CDN / WAF:** Edge security and global asset delivery.
9. **Observability:** End-to-end metrics, logging, and tracing (Section 42).

**Future Scaling Boundaries:**
While the app starts as a monolith, the engineering team must continuously identify and isolate workloads that may become independently scalable services (e.g., Background Ingestion Pipelines or OCR Document Parsers).

## 53. Project Directory Structure
The codebase must be strictly organized using a modern, scalable Next.js directory structure that supports our Modular Monolith and separation of concerns.

**Approved Directory Concepts:**
- `src/app/` - Next.js App Router (Pages, Layouts, Server Actions)
- `src/components/` - Shared UI and Design System (e.g., `/ui/button.tsx`)
- `src/features/` - Domain-specific UI and logic (e.g., `/drugs`, `/portfolio`)
- `src/services/` - Core business logic and permissions boundary
- `src/repositories/` - Direct database interaction layer
- `src/lib/` - Third-party abstractions (Queue, Logger, Storage)
- `src/db/` - Database schemas, migrations, and seed data
- `src/types/` & `src/schemas/` - TypeScript definitions and Zod validations
- `src/jobs/` - Asynchronous worker definitions

**Architectural Enforcement:**
- The structure must adapt to modern Next.js App Router conventions (e.g., colocating route-specific components inside `/app` when appropriate, but keeping domains isolated in `/features` or `/services`).

## 54. Configuration Management
Environment variables and application settings must be strictly managed and centrally validated.

**Required Configuration Categories:**
- DATABASE, AUTH, STORAGE, CACHE
- SEARCH, EMAIL, QUEUE, OBSERVABILITY
- SECURITY, APPLICATION

**Architectural Constraints:**
- **CRITICAL RULE:** All required environment variables must be validated at startup or build time (e.g., using a strict schema parser like Zod). 
- The system must instantly throw an error and crash at boot if a critical variable is missing. It must *never* silently fall back or run a production system in a degraded state due to missing secrets.

## 55. Development Environment
The development environment must be highly standardized to guarantee zero-friction onboarding for all engineers.

**Required Toolchain:**
- Operating System: Windows (Native or WSL)
- IDE: Visual Studio Code
- Package Manager: `pnpm` (Strictly enforced, do not use `npm` or `yarn`)
- Formatting & Linting: Biome
- Version Control: Git

**Standardized Commands (`pnpm` only):**
All core engineering tasks must map to a standardized `package.json` script:
- Installation: `pnpm install`
- Development Server: `pnpm dev`
- Production Build: `pnpm build`
- Production Start: `pnpm start`
- Code Linting: `pnpm lint`
- Code Formatting: `pnpm format`
- Type Checking: `pnpm typecheck`
- Testing (Unit/E2E): `pnpm test`
- Database Schema Gen: `pnpm db:generate`
- Database Migrations: `pnpm db:migrate`
- Database Seeding: `pnpm db:seed`

## 56. Git & CI/CD Workflows
All code changes must be validated automatically via a strict Continuous Integration (CI) pipeline. Manual validation is not an acceptable deployment strategy.

**CI Pipeline Requirements:**
Every Pull Request to the main branch must successfully pass:
1. `pnpm install` (using strict frozen lockfiles).
2. `pnpm lint` (Biome verification).
3. `pnpm typecheck` (TypeScript strict mode).
4. `pnpm test` (Unit/Integration tests).
5. `pnpm build` (Validating successful Next.js production compilation).

**Deployment Strategy:**
- Production deployments must never rely on manual code modifications (e.g., manually editing environment files on a server).
- Rely on environment separation (Development, Staging, Production) driven dynamically by CI/CD configuration management.

## 57. Demo / Seed Data Safety
All seed data and demonstrative configurations used in development or staging must be completely unambiguous regarding their authenticity.

**Safety Constraints:**
- Create realistic but clearly fictional seed/demo data for UI testing.
- **CRITICAL RULE:** Do NOT present fake regulatory data as real. Medical and legal accuracy boundaries must be strictly observed.
- Seed data titles or metadata must explicitly include disclaimers such as "Demo Data", "Sample Data", or "Fictional Example" to prevent any accidental presentation to external stakeholders as genuine regulatory intelligence.

## 58. Data Integrity & Deduplication
The database and ingestion layer must defensively protect against bad data, duplication, and historical data loss.

**Integrity Constraints:**
- **Duplication Prevention:** Use strict multi-column `uniqueIndex` constraints (e.g., `drug_name` + `manufacturer_id`) in PostgreSQL to physically block duplicate records from being created by race conditions in the ingestion pipeline.
- **Foreign Key Enforcement:** Invalid relationships and orphan documents must be prevented at the database level using strict foreign keys (`.references()`).
- **Idempotency:** All ingestion webhooks and jobs must be fully idempotent. Processing the same FDA XML file twice must not result in duplicate regulatory events.
- **No Hard Deletes:** Accidental deletion of historical regulatory intelligence is strictly prohibited. Use soft deletes (`isActive: false`) or strict audit logging before archiving.

## 59. API Security & Access Control
The B2B API boundary requires enterprise-grade protection mechanisms independently of the frontend dashboard authentication.

**Required API Capabilities:**
- Strict Bearer API authentication and scoped API Key Management (Token Rotation).
- Granular Scope/Permission System for third-party consumers.
- Redis-backed Rate Limiting to prevent denial-of-service and abuse.
- Mandatory Zod request validation before hitting Service layers.
- Detailed Usage Logging (metering) tied directly into the observability stack.

**Architectural Constraint:**
- **CRITICAL RULE:** Never place secret API keys or service tokens in browser JavaScript. All secrets must remain strictly confined to the Node.js server boundary.

## 60. Billion-Scale Data Strategy
The platform must maintain a concrete, staged roadmap for scaling to billion-record datasets and high-throughput traffic. "Unlimited scalability" claims are prohibited; every architectural evolution must acknowledge its inherent operational tradeoffs.

**Scaling Roadmap Enforcement:**
The architecture must evolve exclusively through the following strict progression:
- **Stage 1:** Single production DB + Redis Caching + CDN (Monolith).
- **Stage 2:** Read Replicas + Queue Workers + Dedicated Search Engine.
- **Stage 3:** Database Partitioning (e.g., partitioning audit logs by month).
- **Stage 4:** Regional App Deployment + Regional Data.
- **Stage 5:** Horizontal Scaling + Selective Sharding + Service Extraction.

## 61. UX Principles & Progressive Disclosure
The user interface must be strictly optimized for Clarity, Trust, Speed, Discoverability, Consistency, Low cognitive load, and absolute Professionalism.

**Navigation Constraint:**
A user must *always* instantly understand where they are within the platform hierarchy and what actions are immediately available to them.

**Progressive Disclosure Hierarchy:**
Complex medical and regulatory intelligence must NEVER be dumped onto the screen simultaneously. It must follow a strict vertical/interactive disclosure pattern:
1. **Summary:** (Top level, scannable)
2. **Key Facts:** (Bullet points or metric cards)
3. **Detailed Information:** (Expanded text, paragraphs, structured data)
4. **Historical Details:** (Timelines, past events)
5. **Source Documents:** (Links to original FDA/EMA PDFs at the deepest layer)

## 62. Mobile Experience
The platform must be built with a "mobile-first" or "mobile-equal" mindset. Medical professionals frequently access intelligence on mobile devices during transit or off-site meetings.

**Priority Mobile Flows:**
- Search and Drug Lookup
- Regulatory Status verification
- Manufacturer and Document access
- Account & Security access

**Architectural Constraint:**
- **CRITICAL RULE:** Do NOT create a desktop-only data-table experience. Data heavy interfaces (like massive regulatory tables) must elegantly degrade into stacked cards, swipeable lists, or summary views on mobile breakpoints. Horizontal scrolling on a raw HTML table is unacceptable.

## 63. Security & Admin UX
Administrative interfaces must actively protect users from making catastrophic mistakes via strict UX friction.

**Dangerous Actions:**
- Hard Deletions (if permitted)
- Publishing sensitive regulatory documents globally
- Revoking organization access
- Changing RBAC permissions
- Rotating API credentials

**Required UX Flow for Dangerous Actions:**
1. **Explicit Confirmation:** The user must explicitly confirm the action (e.g., typing the name of the resource).
2. **Consequence Explanation:** The UI must clearly state the exact blast radius of the action.
3. **Permission Checks & Re-authentication:** The server must re-verify the role, and high-risk actions should ideally require the user to re-authenticate or input their password.
4. **Audit Event:** The action must trigger a strict, immutable entry in the `audit_logs` database table.

## 64. Final Product Quality
The ultimate deliverable must definitively separate itself from amateur software development.

**Anti-Patterns (Strictly Forbidden):**
The final platform must NOT resemble or feel like:
- A university student assignment.
- A basic, unstyled CRUD (Create/Read/Update/Delete) tutorial project.
- A generic, copy-pasted UI template dashboard.
- A thoughtless AI-generated website.
- A simple, static portfolio page.

**The Target Identity:**
The platform must exude the gravitas, reliability, and extreme polish of a serious, venture-backed Enterprise software product positioned at the intersection of:
**Medical Technology + Regulatory Intelligence + Pharmaceutical Data + Enterprise Platform.**

Every shadow, typographic choice, interaction state, database transaction, and error boundary must reflect absolute premium engineering.

## 65. Required Development Process
To maintain absolute control over the codebase quality and prevent context loss or spaghetti code, all implementation must strictly follow a defined sequence.

**Process Constraints:**
- **CRITICAL RULE:** Do NOT immediately start generating hundreds of files across the stack simultaneously.
- Code generation must follow a systematic, sequential process to ensure every component, service, and page is thoroughly vetted before moving to the next layer.

**The Implementation Sequence:**
- **PHASE 1 — DISCOVERY:** Analyze the entire requirement set. Categorize functional, non-functional, security, performance, data, and scalability requirements. Document reasonable engineering assumptions for anything missing, without halting development.
- **PHASE 2 — ARCHITECTURE:** Produce explicit architecture definitions covering: system, frontend, backend, database, storage, caching, search, authentication, authorization, background-job, observability, and deployment.
- **PHASE 3 — DATABASE DESIGN:** Create a complete Entity Relationship model defining entities, fields, relationships, indexes, constraints, partitioning considerations, and the audit strategy.
- **PHASE 4 — UX/UI SYSTEM:** Define the design system, navigation structures, component hierarchy, page layouts, responsive behaviors, accessibility standards, and state management (empty, loading, error).
- **PHASE 5 — IMPLEMENTATION:** Execute the physical code generation strictly bounded by the definitions mapped in Phases 1-4. Implementation must proceed incrementally in this exact priority sequence:
  1. Project Foundation
  2. Design System
  3. Authentication
  4. Database
  5. Core Backend Services
  6. Drug System
  7. Regulatory System
  8. Manufacturer System
  9. Document System
  10. Portfolio System
  11. Search
  12. Dashboards
  13. Admin
  14. Analytics
  15. Optimization
- **PHASE 6 — HARDENING:** After implementation, execute a strict verification protocol: typecheck, lint, format, test, security review, query review, performance review, accessibility review, and dependency review. Fix all issues rather than ignoring them.

## 66. Developer & AI Behavior Rules
To ensure the integrity of the architecture is not compromised during implementation, the following behavioral rules are strictly enforced during code generation:

**Strict Prohibitions:**
- **DO NOT** invent APIs or fabricate regulatory facts/claims.
- **DO NOT** expose secrets, store secrets in source code, or use fake security claims.
- **DO NOT** silently swallow errors (`try { ... } catch { /* ignore */ }` is banned).
- **DO NOT** create giant monolithic files. Adhere to the Modular Monolith structure.
- **DO NOT** duplicate logic unnecessarily (DRY).
- **DO NOT** use deprecated Next.js APIs (e.g., old Pages router patterns).
- **DO NOT** use `npm` commands (Strictly use `pnpm` as established).
- **DO NOT** ignore TypeScript errors or blindly use `any`.
- **DO NOT** disable Biome/Linters (`// biome-ignore`) merely to make a build pass.
- **DO NOT** sacrifice security for convenience.

**Core Philosophy:**
Prefer maintainability over cleverness. The codebase must be highly readable and predictable.

## 69. Production Standard
The ultimate, non-negotiable directive: Build the platform as a **real production architecture**, not a visual mockup.

**Mandatory Feature Checklists:**
Every major feature implemented must encompass and address:
- Frontend (Server Components / UI)
- Backend (Server Actions / Services)
- Database (Schema / Drizzle Constraints)
- Validation (Zod Payloads)
- Permissions (RBAC Checks at the Service Layer)
- Error Handling (Graceful degradation, Error Boundaries)
- Loading State (Skeletons / Suspense)
- Security Considerations (Secrets isolation, audit logging)
- Scalability Considerations (Queue offloading, pagination)

Use sensible abstractions and ensure the platform remains extensible at all times.

## 67. Documentation
The platform must maintain exhaustive, professional-grade documentation explaining all architectural decisions and operational requirements.

**Required Documentation Artifacts:**
- `README.md`
- `ARCHITECTURE.md` (or `docs/SYSTEM_ARCHITECTURE.md`)
- `DATABASE.md` (or `docs/DATABASE_DESIGN.md`)
- `SECURITY.md`
- `SCALABILITY.md` (or `docs/SCALABILITY_ROADMAP.md`)
- `API.md`
- `DEPLOYMENT.md`
- `ENVIRONMENT.md`
- `CONTRIBUTING.md`

## 68. Final Deliverable Summary
At the conclusion of the architecture and planning sprint, a comprehensive final deliverable must be provided summarizing the entire systemic foundation before moving to implementation.

**Required Deliverable Contents:**
1. Architecture overview
2. Directory structure
3. Database schema
4. Major components
5. Backend modules
6. Security model
7. Scalability strategy
8. Deployment strategy
9. Environment variables
10. `pnpm` commands
11. Database migration commands
12. Testing strategy
13. Known limitations
14. Future scaling roadmap
