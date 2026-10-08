# Phase 4: UX & UI System Design

This document satisfies the **Phase 4** requirement by explicitly defining the visual identity, component architecture, and interaction states for the Legalnorms Consultations platform.

## 1. Design System (Premium MedTech)
The design system completely rejects generic CRUD templates. It aims for the gravitas of a high-end enterprise medical platform.
- **Color Palette:** 
  - *Primary:* Deep Slate/Navy (Trust, Authority).
  - *Accents:* Medical Blue (Action), Emerald Green (Approval/Clearance), Amber (Warnings/Alerts).
- **Typography:** Clean, sans-serif fonts optimized for scanning dense data (e.g., Inter, Roboto). Tabular numerals are mandatory for all metrics and dates to ensure vertical alignment.
- **Spacing/Shadows:** High whitespace density. Minimalist, crisp borders with subtle, diffused drop-shadows. No excessive rounded corners (glassmorphism is forbidden as it reduces readability).

## 2. Navigation Architecture
- **Global Sidebar (Desktop):** A sticky left-hand navigation pane containing the core domains: Dashboard, Drug Directory, Regulatory Intelligence, Clinical Trials, Settings.
- **Breadcrumbs:** Mandatory on every page. Users must instantly know their hierarchical location (e.g., `Home > Drugs > Aeternum-X > Regulatory Events`).
- **Contextual Tabs:** Used heavily on entity detail pages (e.g., viewing a Drug profile reveals tabs for "Overview", "Applications", "Adverse Events").

## 3. Component System
Components are built using **Tailwind CSS v4 + React Server Components**.
- **Primitives:** Reusable, stateless UI blocks (Buttons, Inputs, Badges).
- **Composite/Strict Pattern Components:** 
  - `ProgressiveDisclosure` (Requirement 61): Forces complex regulatory text into expandable tiers.
  - `CriticalActionDialog` (Requirement 63): Forces type-to-confirm friction for dangerous server actions.

## 4. Page Layouts
- **Index/Directory Pages:** A prominent unified Search Bar at the top, followed by a filter sidebar (left) and the primary data grid/list (right). Filters strictly sync to URL query parameters.
- **Entity Detail Pages:** A two-column layout. A sticky summary card on the left (or top on mobile) detailing immutable facts (Drug Name, Manufacturer). The wider right column scrolls through deep historical data and documents.
- **Form Pages (Ingestion/Edit):** Centered, focused layouts. Distracting navigation is hidden to prevent accidental data loss during complex medical data entry.

## 5. Responsive Behavior
**Mobile-Equal Architecture** (Requirement 62):
- The `ResponsiveDataList` component is globally enforced. Dense `<table>` structures automatically destruct on mobile breakpoints and reform into vertical stacks of semantic `<article>` cards.
- Complex sidebars collapse into Hamburger/Drawer menus.
- Horizontal scrolling is completely banned.

## 6. Accessibility (A11y)
- **Contrast:** Strict WCAG AA compliance for all text against backgrounds. 
- **Keyboard Navigation:** Every interactive element must be fully reachable via `Tab`. Modal dialogs must trap focus.
- **Screen Readers:** ARIA labels must be explicitly defined for iconic buttons (e.g., `<button aria-label="Download FDA XML Document"><DownloadIcon/></button>`).

## 7. Interaction States
- **Loading:** Reject generic spinning circles for initial page loads. Use structural Skeleton UI that mimics the shape of the incoming regulatory data to reduce perceived latency.
- **Empty States:** Never show a blank screen. Empty states must include an illustration, a clear explanation ("No Regulatory Events Found"), and a primary Call-to-Action ("Track this Drug").
- **Error States:** Graceful degradation. If a specific component (e.g., the PDF Viewer) fails, the React Error Boundary catches it and renders a localized fallback, preventing the entire dashboard from crashing.
