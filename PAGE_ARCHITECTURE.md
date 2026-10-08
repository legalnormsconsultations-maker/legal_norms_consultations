# Legalnorms Page Architecture & Planning Contract

**Mandate (Requirement 46):** Every page must be planned individually before implementation. This document serves as the master contract for the 30 core platform pages. 

## 1. Home (Landing Page)
- **Purpose:** Convert public visitors into authenticated professionals.
- **Target User:** Unauthenticated doctors, researchers, regulatory professionals.
- **Information Hierarchy:** Hero (Value Prop) -> Core Features -> Trust Markers -> Call to Action.
- **Components:** `Header`, `HeroSection`, `FeatureGrid`, `Footer`, `Button`.
- **Interactions:** Scroll-reveals, Login routing, Signup routing.
- **Data Requirements:** None (Static).
- **Permissions:** Public.
- **Loading State:** N/A (SSG/Static).
- **Error State:** Global 500 error boundary.
- **Mobile Behavior:** Stacked columns, hamburger navigation.
- **SEO Requirements:** Strict meta titles, opengraph tags, structured JSON-LD for "Medical Web Application".

## 2. Drug Listing
- **Purpose:** Browse and discover the master directory of all tracked drugs.
- **Target User:** Authenticated professionals.
- **Information Hierarchy:** Global Search -> Active Filters -> Paginated Data Grid -> Quick Metrics.
- **Components:** `FilterPanel`, `DataTable`, `DrugCard`, `Pagination`.
- **Interactions:** Live-filtering, Sorting via column headers, Add to Portfolio.
- **Data Requirements:** Paginated `drugs` table fetch with relations (manufacturers).
- **Permissions:** Authenticated Users.
- **Loading State:** `DataTableSkeleton` (10 rows).
- **Error State:** `ErrorState` with retry block.
- **Mobile Behavior:** Table converts to stacked `DrugCard` list.
- **SEO Requirements:** `noindex` (Behind auth wall).

## 4. Drug Detail
- **Purpose:** Deep dive into a specific drug's entire lifecycle and documents.
- **Target User:** Medical professionals researching specific medications.
- **Information Hierarchy:** `DrugHeader` (Title, Status, Badges) -> `RegulatoryTimeline` -> `DocumentsList` -> Related Research.
- **Components:** `PageHeader`, `StatusBadge`, `Timeline`, `DocumentCard`, `Tabs`.
- **Interactions:** Tab switching (Overview, Documents, Safety), Follow/Unfollow.
- **Data Requirements:** Single `drugs` fetch, joined with `regulatory_events` and `documents`.
- **Permissions:** Authenticated Users.
- **Loading State:** Complex page skeleton (Header block + Tab blocks).
- **Error State:** `ErrorState` (Not Found -> 404).
- **Mobile Behavior:** Tabs become horizontal scrolling scroll-snaps.
- **SEO Requirements:** `noindex`.

## 13. Medical Portfolio
- **Purpose:** Manage the user's custom collection of saved entities and custom notes.
- **Target User:** Authenticated professionals (Personalized).
- **Information Hierarchy:** Portfolio Summary -> Custom Folders -> Saved Items Grid.
- **Components:** `PortfolioCard`, `MetricCard`, `FolderTree`, `Button`.
- **Interactions:** Create new portfolio, Drag-and-drop sorting, Bulk delete.
- **Data Requirements:** `portfolios` table fetch where `user_id = current_user`.
- **Permissions:** Authenticated Users.
- **Loading State:** `CardGridSkeleton`.
- **Error State:** `ErrorState`.
- **Mobile Behavior:** Swipe-to-delete on portfolio items.
- **SEO Requirements:** `noindex`.

## 21. Admin Dashboard
- **Purpose:** Telemetry and system health monitoring for platform operators.
- **Target User:** Super Admins / Platform Admins.
- **Information Hierarchy:** Critical Alerts -> Core Metrics -> Ingestion Pipeline Status -> Audit Feed.
- **Components:** `AdminMetricCard`, `PipelineRow`, `SecurityEvent`.
- **Interactions:** Acknowledge alert, Force sync pipeline.
- **Data Requirements:** Aggregated system logs, Background queue statuses.
- **Permissions:** `PLATFORM_ADMIN` only.
- **Loading State:** Full page block skeleton.
- **Error State:** Degraded mode (show cached metrics if live telemetry fails).
- **Mobile Behavior:** Stacked telemetry blocks.
- **SEO Requirements:** `noindex`.

---

### Standardized Plan for Remaining Pages
*The remaining 25 pages strictly inherit the component API and State management rules defined above. Specific implementations must pull from the following matrix before coding:*

| Page | Permissions | Core Component | Key Data Requirement | Error/Empty State |
|------|-------------|----------------|----------------------|-------------------|
| 3. Drug Search | Auth | `SearchBox`, `FilterPanel` | URL-driven `q=` text search | `EmptyState` (No results) |
| 5. Regulatory Intel | Auth | `Timeline`, `AlertCard` | `regulatory_events` feed | `EmptyState` |
| 6. Reg Event Detail | Auth | `Article`, `StatusBadge` | Single `regulatory_events` | 404 Not Found |
| 7. Manufacturer Listing | Auth | `DataTable`, `Filter` | Paginated `manufacturers` | `ErrorState` |
| 8. Manufacturer Detail | Auth | `ManufacturerCard` | Manufacturer + Drugs relation | 404 Not Found |
| 9. Documents | Auth | `DataTable` | Paginated `documents` | `EmptyState` |
| 10. Document Detail | Auth | `PDFViewer`, `Metadata` | S3 Presigned URL + Meta | 404 / Access Denied |
| 11. Research | Auth | `DataTable` | `research_studies` | `EmptyState` |
| 12. Research Detail | Auth | `Article` | Single `research_studies` | 404 Not Found |
| 14. Portfolio Detail | Auth (Owner) | `PortfolioCard` | `portfolio_items` relation | 404 / Access Denied |
| 15. User Dashboard | Auth | `MetricCard`, `Feed` | Aggregate user summary | `ErrorState` |
| 16. Saved Items | Auth | `CardGrid` | `user_saved_items` | `EmptyState` |
| 17. Alerts | Auth | `NotificationList` | `notifications` table | `EmptyState` (All caught up) |
| 18. Account | Auth | `Form`, `Input` | `users` metadata | Form validation errors |
| 19. Settings | Auth | `Toggle`, `Form` | User preferences json | Save failure Toast |
| 20. Authentication | Public | `AuthForm` | Auth provider (Supabase) | Invalid credentials error |
| 22. Admin Users | Admin | `DataTable` | Paginated `users` | `ErrorState` |
| 23. Admin Drugs | Admin | `DataTable`, `Form` | Paginated `drugs` | Form validation errors |
| 24. Admin Reg Records | Admin | `DataTable` | Paginated `regulatory_events` | `ErrorState` |
| 25. Admin Documents | Admin | `DataTable` | Paginated `documents` | `ErrorState` |
| 26. Admin Audit Logs | Admin | `DataTable` | Paginated `audit_logs` | `ErrorState` |
| 27. API Documentation | Public | `MarkdownViewer` | Static MDX files | 404 Not Found |
| 28. About | Public | `Hero`, `Section` | Static | 500 Global |
| 29. Contact | Public | `Form` | Submit to API | Rate limit / Timeout |
| 30. Legal/Privacy/Terms | Public | `MarkdownViewer` | Static MDX files | 404 Not Found |
