import { z } from "zod";

/**
 * Strict Environment Validation Schema (Requirement 54)
 * Categorized by domain.
 * Missing variables will cause a hard crash at boot time.
 */
const envSchema = z.object({
  // APPLICATION
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url(),

  // DATABASE
  DATABASE_URL: z.string().url(),

  // FIRST-PARTY AUTH
  AUTH_SECRET: z.string().min(32),
  AUTH_EMAIL_PROVIDER: z.enum(["smtp", "resend"]).optional(),
  AUTH_EMAIL_FROM: z.string().email().optional(),
  RESEND_API_KEY: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_CLIENT_ID: z.string().optional(),
  MICROSOFT_CLIENT_SECRET: z.string().optional(),
  MICROSOFT_TENANT_ID: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_API_VERSION: z.string().optional(),
  X_CLIENT_ID: z.string().optional(),
  X_CLIENT_SECRET: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_TEAM_ID: z.string().optional(),
  APPLE_KEY_ID: z.string().optional(),
  APPLE_PRIVATE_KEY: z.string().optional(),
  DISCORD_CLIENT_ID: z.string().optional(),
  DISCORD_CLIENT_SECRET: z.string().optional(),

  // STORAGE
  STORAGE_BUCKET_NAME: z.string().min(1),
  STORAGE_REGION: z.string().min(1),
  STORAGE_ACCESS_KEY: z.string().min(1),
  STORAGE_SECRET_KEY: z.string().min(1),

  // CACHE
  REDIS_URL: z.string().url(),

  // SEARCH (Optional during dev, required in prod)
  SEARCH_API_KEY: z.string().optional(),

  // QUEUE
  WORKER_QUEUE_URL: z.string().url().optional(),

  // OBSERVABILITY
  DATADOG_API_KEY: z.string().optional(),

  // SECURITY
  ENCRYPTION_SECRET_KEY: z.string().min(32), // Must be at least 32 chars for AES
});

// Extract the inferred TypeScript types
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate and export configuration singleton.
 * Next.js evaluates this file on boot; if `safeParse` fails, the server dies immediately.
 */
function validateEnv(): EnvConfig {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid or missing environment variables:\n",
      parsed.error.flatten().fieldErrors,
    );
    // Hard crash rule enforced: Do not silently boot in a degraded state.
    process.exit(1);
  }

  return parsed.data;
}

export const env = validateEnv();
