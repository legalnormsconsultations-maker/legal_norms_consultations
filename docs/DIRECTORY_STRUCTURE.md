# Legalnorms Consultations - Directory Structure

The platform uses a feature-sliced, Modular Monolith architecture within the Next.js App Router paradigm.

```text
legalnorms-consultations/
├── docs/                      # Architectural specifications and ADRs
├── next.config.ts             # Framework configuration (standalone mode)
├── Dockerfile                 # Stateless containerization
├── package.json               
└── src/                       # Core application source
    ├── app/                   # Next.js App Router (Routing, Layouts, Server Actions)
    │   ├── (public)/          # Unauthenticated marketing/SEO pages
    │   ├── (dashboard)/       # Authenticated professional dashboard
    │   ├── (admin)/           # Strict RBAC admin console
    │   └── api/               # External B2B API endpoints (documented via OpenAPI)
    │
    ├── components/            # Reusable UI & Design System
    │   ├── ui/                # Core primitives (Button, Input, Skeleton)
    │   └── layout/            # Navigation, headers, footers
    │
    ├── features/              # Feature-Sliced Domain Logic (UI specific)
    │   ├── drugs/             # Drug-specific components, hooks, and fragments
    │   ├── portfolio/         # Medical portfolio components
    │   └── auth/              # Authentication wrappers and components
    │
    ├── services/              # Business Logic & Authorization boundaries (Node.js/Server only)
    ├── repositories/          # Database interaction layer (Drizzle ORM)
    │
    ├── db/                    # Infrastructure state
    │   ├── schema.ts          # Postgres schemas
    │   └── migrations/        # Drizzle migration SQL files
    │
    ├── lib/                   # Third-party integrations & abstractions
    │   ├── logger.ts          # Structured JSON logging
    │   ├── queue.ts           # Async worker dispatching
    │   ├── storage.ts         # S3/Blob interface
    │   └── notifications.ts   # Multi-channel alert dispatching
    │
    ├── types/                 # Global TypeScript definitions
    ├── schemas/               # Zod validation schemas
    ├── i18n/                  # Localization dictionaries and loaders
    └── __tests__/             # Unit, Integration, and Architecture tests
```

### Key Principles:
1. **The Server Action Rule:** `src/app/` should mostly contain routing logic and simple Server Actions that immediately delegate to `src/services/`. Server actions should NEVER contain raw SQL queries.
2. **The Encapsulation Rule:** A component in `src/features/drugs` should never import a component from `src/features/portfolio` directly. They should communicate via shared state, database records, or centralized `src/components/` utilities.
