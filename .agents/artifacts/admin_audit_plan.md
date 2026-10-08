# Admin Panel Audit & Implementation Plan

After conducting a comprehensive audit of the `/admin` section, here is the list of features, pages, and components that are either using mock data, hardcoded placeholders, or are entirely missing.

## 1. Client Projects Page (Dead Link)
- **Status:** **Missing**
- **Issue:** The sidebar has a link to `/admin/projects`, but the actual `page.tsx` does not exist, leading to a 404 error.
- **Plan:** 
  - Create `src/app/admin/projects/page.tsx`.
  - Create a Client Component for CRUD operations.
  - Connect it to the existing `portfolioProjects` table in `drizzle/schema.ts`.
  - Create a `PortfolioProjectsRepository` to fetch, create, update, and delete projects.

## 2. NDA Trends Dashboard (`/admin/intelligence/nda-trends`)
- **Status:** **Mocked**
- **Issue:** Uses hardcoded arrays (`approvalsByYear`, `reviewTimes`, `therapeuticAreas`) instead of fetching real data.
- **Plan:** 
  - Create a new DB table/schema for `nda_trends` (or aggregate from `approvals` and `regulatory_applications` tables).
  - Create server actions or a repository to run SQL aggregations.
  - Update `nda-trends-client.tsx` to receive real data via props instead of static arrays.

## 3. EMA Signals Details (`/admin/intelligence/ema-signals/[id]`)
- **Status:** **Mocked**
- **Issue:** The page passes a hardcoded `mockSignalData` object to `EmaSignalClient`.
- **Plan:**
  - Create a schema for `regulatory_signals` (EMA signals) including timeline and risk profile.
  - Add API / Repo functions to fetch signal data by ID.
  - Render the client component using real DB data.

## 4. Search Page (`/admin/search`)
- **Status:** **Stubbed / Dummy UI**
- **Issue:** The search page has static filters, fake pagination, and mock result handling.
- **Plan:**
  - Implement a real global search repository that queries across multiple tables (`drugs`, `documents`, `articles`).
  - Implement server-side pagination and filtering based on URL `searchParams`.
  - Connect the filters in the sidebar to real URL updates.

## 5. Client Dashboard Metrics (`/admin/dashboard`)
- **Status:** **Partially Mocked**
- **Issue:** While it queries `DashboardService`, the System Status feed is hardcoded ("EMA Database Sync Completed 14 minutes ago"), and the "Portfolio Activity" section is a placeholder. "Portfolio Views" metric is stubbed.
- **Plan:**
  - Connect System Status to the `backgroundJobs` or `apiTelemetry` tables.
  - Fetch real Portfolio Activity from `audit_logs` or `portfolioProjects`.
  - Update `DashboardService` to calculate real views or hide stubbed metrics.

## 6. Guidance Details (`/admin/intelligence/guidance/[id]`)
- **Status:** **Needs Verification / Polish**
- **Issue:** Contains some hardcoded placeholder UI elements (`ListTodo` icons) and static tabs.
- **Plan:**
  - Hook it up to the `fdaGuidances` and `regulatoryTasks` tables properly.
  - Ensure all tabs pull related guidance data dynamically.

---
*We will implement these one by one, ensuring full production-ready code with real database connections and API handlers.*
