import * as dotenv from "dotenv";
import postgres from "postgres";

dotenv.config({ path: ".env.local" });
const sql = postgres(process.env.DATABASE_URL as string);
const q = `select "users"."id", "users"."email", "users"."email_verified", "users"."password_hash", "users"."phone_number", "users"."phone_verified", "users"."roles", "users"."organization_id", "users"."first_name", "users"."last_name", "users"."title", "users"."organization", "users"."professional_summary", "users"."expertise", "users"."medical_interests", "users"."avatar_url", "users"."is_active", "users"."created_at", "users"."updated_at" from "auth_sessions" inner join "users" on "auth_sessions"."user_id" = "users"."id" limit 1`;
sql
  .unsafe(q)
  .then(console.log)
  .catch(console.error)
  .finally(() => process.exit());
