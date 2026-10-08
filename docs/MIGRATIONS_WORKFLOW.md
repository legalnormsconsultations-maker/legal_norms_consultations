# Database Migration Strategy & Workflow

To maintain absolute data integrity and zero-downtime deployments, this project strictly prohibits manual production database edits. All database mutations must occur via Drizzle ORM Migrations.

## 1. Environment Topology

The architecture relies on three distinct, isolated environments:

1. **Development (`.env.local`)**: A local or ephemeral PostgreSQL database (e.g., local Docker or a Supabase local instance) used for prototyping and running initial generation commands.
2. **Staging (`.env.staging`)**: A mirror of the production schema and data volume profile. Used exclusively for testing the CI/CD pipeline and dry-running complex data migrations.
3. **Production (`.env.production`)**: The live cluster. Access is restricted. Mutations occur strictly via automated GitHub Actions / CI deployment steps.

## 2. Standard Migration Workflow (Development)

When modifying `src/db/schema.ts`, follow this workflow:

1. **Generate the Migration:**
   ```bash
   pnpm db:generate
   ```
   *This command diffs your updated `schema.ts` against the previous snapshot and generates a `.sql` file in the `src/db/migrations` folder.*

2. **Review the SQL:**
   Open the generated SQL file. Verify that operations (especially `DROP` or `ALTER COLUMN`) do not accidentally destroy data.

3. **Apply Locally:**
   ```bash
   pnpm db:push
   ```
   *Or run your specific migration runner script against the local database.*

## 3. Production Deployment & CI/CD Strategy

Production migrations are **never applied locally**. They are integrated into the CI/CD pipeline.

- During the deployment phase, the pipeline runs a dedicated script (e.g., `pnpm db:migrate`).
- The migration runner uses a specialized database user with schema-mutation privileges, which is completely isolated from the standard application user credentials.

## 4. Rollback-Aware Strategy

Because Drizzle ORM is forward-only, you must be explicitly rollback-aware:

1. **Additive Changes First:** Never drop a column or table in the same deployment where application code stops using it. First, deploy code that stops writing to the column. Second, deploy a migration that drops the column.
2. **Reverting:** If a bad migration lands, **do not manually delete the SQL file or manually rollback the database.** You must write a *new* migration that reverses the bad changes (e.g., re-adding the column) and deploy it forward.
3. **Data Loss Prevention:** Always use `.default()` or explicitly write custom backfill scripts when adding `NOT NULL` columns to tables with existing data to prevent migration lock-ups or crashes.
