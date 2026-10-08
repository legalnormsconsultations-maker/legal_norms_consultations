# Legalnorms Consultations - Environment Configuration

The application strictly validates all environment variables at boot time using Zod (`src/config/env.ts`). If a required variable is missing, the application will crash immediately rather than serving broken traffic.

## Required Variables

### Database

- `DATABASE_URL`: Connection string to PostgreSQL (e.g., `postgresql://user:password@host:port/db`).

### First-Party Authentication

- `AUTH_SECRET`: At least 32 random characters. Generate locally with `node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"`.
- `NEXT_PUBLIC_SITE_URL`: Exact public origin used for OAuth callback and verification links.
- `AUTH_EMAIL_PROVIDER`: `smtp` or `resend`; set a delivery provider before production signup and account recovery.
- `AUTH_EMAIL_FROM`: Verified sender email address.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`: SMTP configuration if `AUTH_EMAIL_PROVIDER=smtp`.
- `RESEND_API_KEY`: Server-only key if `AUTH_EMAIL_PROVIDER=resend`.
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`: Server-only SMS credentials for phone OTP.

Optional OAuth provider credentials (all secrets remain server-side):
- Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- Microsoft: `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`, optional `MICROSOFT_TENANT_ID`
- GitHub: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- Facebook: `FACEBOOK_CLIENT_ID`, `FACEBOOK_CLIENT_SECRET`, optional `FACEBOOK_API_VERSION`
- X: `X_CLIENT_ID`, `X_CLIENT_SECRET`
- Apple: `APPLE_CLIENT_ID`, `APPLE_TEAM_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY`
- Discord: `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`

Register callback URLs using your exact `NEXT_PUBLIC_SITE_URL`: `/api/auth/oauth/callback/google`, `/api/auth/oauth/callback/microsoft`, `/api/auth/oauth/callback/github`, `/api/auth/oauth/callback/facebook`, `/api/auth/oauth/callback/x`, `/api/auth/oauth/callback/apple`, and `/api/auth/oauth/callback/discord`.

Accounts, password hashes, linked provider IDs, verification challenges, and revocable sessions are stored in this app's PostgreSQL database. Social providers only prove identity; they do not own app sessions or user data. Configure only providers you intend to enable.

### Caching/Queues

- `REDIS_URL`: Connection string to the Redis cluster for rate-limiting and queues.

### Application

- `NEXT_PUBLIC_APP_URL`: The canonical URL of the deployed application (e.g., `https://app.legalnorms.com`).

---

**Note:** Never commit `.env.local` to version control. Reference `.env.example` for scaffolding a new local development environment.
