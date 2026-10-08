# Legalnorms Consultations

Enterprise platform for global regulatory intelligence, drug data, and document tracking.

## Developer Onboarding

This project enforces a highly standardized development environment (Requirement 55). 

### Prerequisites
- **OS:** Windows (Native or WSL)
- **IDE:** Visual Studio Code
- **Node:** v20+
- **Package Manager:** `pnpm` v11+ (Strictly enforced. **Do not use npm or yarn.**)
- **Formatting:** Biome (Install the VS Code Biome extension)

### Standardized Commands
All engineering tasks must map to these standardized `pnpm` commands:

| Command | Description |
|---|---|
| `pnpm install` | Install all dependencies cleanly using the lockfile. |
| `pnpm dev` | Start the local Next.js development server on `localhost:3000`. |
| `pnpm build` | Compile a highly-optimized, standalone production build. |
| `pnpm start` | Run the compiled production server. |
| `pnpm lint` | Run Biome linting checks. |
| `pnpm format` | Run Biome auto-formatting across the codebase. |
| `pnpm typecheck` | Run a strict TypeScript compiler check (`tsc --noEmit`). |
| `pnpm test` | Execute the Vitest unit, integration, and security test suites. |
| `pnpm db:generate` | Generate Drizzle SQL migrations based on changes in `src/db/schema.ts`. |
| `pnpm db:migrate` | Apply pending SQL migrations to the connected PostgreSQL database. |
| `pnpm db:seed` | Seed the database with required standard taxonomies (mock drugs, roles, etc.). |

## Architecture & System Rules
Before contributing code, you **must** read the following architectural contracts:
1. `SYSTEM_REQUIREMENTS.md` - The 55 master rules governing this platform.
2. `docs/PAGE_ARCHITECTURE.md` - The UI and RBAC plans for all 30 core pages.
3. `docs/DIRECTORY_STRUCTURE.md` - The Modular Monolith boundaries.
4. `docs/ARCHITECTURE_DECISIONS.md` - ADRs regarding future microservice extractions.
