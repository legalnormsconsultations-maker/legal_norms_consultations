# Contributing to Legalnorms Consultations

Thank you for contributing to the platform. To maintain our "Enterprise Premium" quality standards, all developers must adhere to the following strict process.

## 1. Local Development Setup
1. Clone the repository.
2. Run `pnpm install` (Do NOT use `npm` or `yarn`).
3. Copy `.env.example` to `.env.local` and populate the variables.
4. Run `pnpm db:generate` and `pnpm db:migrate` to set up your local PostgreSQL instance.
5. Run `pnpm dev` to start the development server.

## 2. Code Quality Standards
- **Strict TypeScript:** No `any`. No `@ts-ignore` without a written justification comment.
- **Formatting & Linting:** We use Biome. Ensure `pnpm lint` and `pnpm format` pass before committing.
- **Testing:** All new services must be accompanied by Vitest unit/integration tests (`pnpm test`).

## 3. Pull Request Process
1. Branch from `main` using the format `feature/your-feature-name` or `fix/issue-description`.
2. Do not include giant monolithic files. Break logic into the Modular Monolith structure (`src/features`, `src/services`, `src/repositories`).
3. Ensure the CI pipeline (GitHub Actions) passes fully.
4. Request review from at least one core architect.

## 4. Architectural Rules
Read `SYSTEM_REQUIREMENTS.md` before writing code. Ignorance of the 67 architectural constraints is not an excuse for bypassing them.
