import "server-only";

import { createHash } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { createRemoteJWKSet, importPKCS8, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import * as oauth from "oauth4webapi";
import { z } from "zod";
import { db } from "@/db";
import { authAccounts, authChallenges, users } from "@/db/schema";
import {
  createOpaqueToken,
  hashChallenge,
  sealSecret,
  unsealSecret,
} from "@/lib/auth/crypto";
import { sendOAuthVerification } from "@/lib/auth/service";
import { createSession } from "@/lib/auth/session";

export const oauthProviders = [
  "google",
  "microsoft",
  "github",
  "facebook",
  "x",
  "apple",
  "discord",
  "linkedin",
] as const;

export type OAuthProvider = (typeof oauthProviders)[number];

const profileSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  emailVerified: z.boolean().default(false),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type ProviderConfig = {
  clientId: string;
  clientSecret: string | (() => Promise<string>);
  authMethod: "post" | "basic";
  authorizationEndpoint: string;
  tokenEndpoint: string;
  profileEndpoint?: string;
  issuer: string;
  scopes: string[];
};

function envValue(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`OAuth provider is not configured: ${name}.`);
  return value;
}

async function appleClientSecret(): Promise<string> {
  const key = await importPKCS8(
    envValue("APPLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    "ES256",
  );
  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: envValue("APPLE_KEY_ID") })
    .setIssuer(envValue("APPLE_TEAM_ID"))
    .setSubject(envValue("APPLE_CLIENT_ID"))
    .setAudience("https://appleid.apple.com")
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(key);
}

function providerConfig(provider: OAuthProvider): ProviderConfig {
  const version = process.env.FACEBOOK_API_VERSION ?? "v23.0";
  switch (provider) {
    case "google":
      return {
        clientId: envValue("GOOGLE_CLIENT_ID"),
        clientSecret: envValue("GOOGLE_CLIENT_SECRET"),
        authMethod: "post",
        authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenEndpoint: "https://oauth2.googleapis.com/token",
        profileEndpoint: "https://openidconnect.googleapis.com/v1/userinfo",
        issuer: "https://accounts.google.com",
        scopes: ["openid", "email", "profile"],
      };
    case "microsoft": {
      const tenant = process.env.MICROSOFT_TENANT_ID ?? "common";
      const issuer = `https://login.microsoftonline.com/${tenant}/v2.0`;
      return {
        clientId: envValue("MICROSOFT_CLIENT_ID"),
        clientSecret: envValue("MICROSOFT_CLIENT_SECRET"),
        authMethod: "post",
        authorizationEndpoint: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`,
        tokenEndpoint: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
        profileEndpoint: "https://graph.microsoft.com/oidc/userinfo",
        issuer,
        scopes: ["openid", "email", "profile", "User.Read"],
      };
    }
    case "github":
      return {
        clientId: envValue("GITHUB_CLIENT_ID"),
        clientSecret: envValue("GITHUB_CLIENT_SECRET"),
        authMethod: "post",
        authorizationEndpoint: "https://github.com/login/oauth/authorize",
        tokenEndpoint: "https://github.com/login/oauth/access_token",
        profileEndpoint: "https://api.github.com/user",
        issuer: "https://github.com",
        scopes: ["read:user", "user:email"],
      };
    case "facebook":
      return {
        clientId: envValue("FACEBOOK_CLIENT_ID"),
        clientSecret: envValue("FACEBOOK_CLIENT_SECRET"),
        authMethod: "post",
        authorizationEndpoint: `https://www.facebook.com/${version}/dialog/oauth`,
        tokenEndpoint: `https://graph.facebook.com/${version}/oauth/access_token`,
        profileEndpoint: `https://graph.facebook.com/${version}/me?fields=id,first_name,last_name,email`,
        issuer: "https://www.facebook.com",
        scopes: ["email", "public_profile"],
      };
    case "x":
      return {
        clientId: envValue("X_CLIENT_ID"),
        clientSecret: envValue("X_CLIENT_SECRET"),
        authMethod: "basic",
        authorizationEndpoint: "https://x.com/i/oauth2/authorize",
        tokenEndpoint: "https://api.x.com/2/oauth2/token",
        profileEndpoint:
          "https://api.x.com/2/users/me?user.fields=name,username",
        issuer: "https://x.com",
        scopes: ["users.read"],
      };
    case "apple":
      return {
        clientId: envValue("APPLE_CLIENT_ID"),
        clientSecret: appleClientSecret,
        authMethod: "post",
        authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
        tokenEndpoint: "https://appleid.apple.com/auth/token",
        issuer: "https://appleid.apple.com",
        scopes: ["openid", "email", "name"],
      };
    case "discord":
      return {
        clientId: envValue("DISCORD_CLIENT_ID"),
        clientSecret: envValue("DISCORD_CLIENT_SECRET"),
        authMethod: "post",
        authorizationEndpoint: "https://discord.com/oauth2/authorize",
        tokenEndpoint: "https://discord.com/api/oauth2/token",
        profileEndpoint: "https://discord.com/api/users/@me",
        issuer: "https://discord.com",
        scopes: ["identify", "email"],
      };
    case "linkedin":
      return {
        clientId: envValue("LINKEDIN_CLIENT_ID"),
        clientSecret: envValue("LINKEDIN_CLIENT_SECRET"),
        authMethod: "post",
        authorizationEndpoint:
          "https://www.linkedin.com/oauth/v2/authorization",
        tokenEndpoint: "https://www.linkedin.com/oauth/v2/accessToken",
        profileEndpoint: "https://api.linkedin.com/v2/userinfo",
        issuer: "https://www.linkedin.com/oauth",
        scopes: ["openid", "profile", "email"],
      };
  }
}

function providerAuthorizationServer(
  config: ProviderConfig,
): oauth.AuthorizationServer {
  return {
    issuer: config.issuer,
    authorization_endpoint: config.authorizationEndpoint,
    token_endpoint: config.tokenEndpoint,
  };
}

function applicationUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, baseUrl).toString();
}

export async function getOAuthAuthorizationUrl(
  provider: OAuthProvider,
): Promise<string> {
  const config = providerConfig(provider);
  const state = createOpaqueToken();
  const verifier = createOpaqueToken(48);
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const callbackUrl = applicationUrl(`/api/auth/oauth/callback/${provider}`);

  await db.insert(authChallenges).values({
    challengeType: "oauth_state",
    identifier: provider,
    tokenHash: hashChallenge(state),
    metadata: { verifier: sealSecret(verifier) },
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const url = new URL(config.authorizationEndpoint);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", callbackUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", config.scopes.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  if (provider === "apple") url.searchParams.set("response_mode", "form_post");
  return url.toString();
}

type OAuthProfile = z.infer<typeof profileSchema>;

async function providerProfile(
  provider: OAuthProvider,
  config: ProviderConfig,
  accessToken: string,
  idToken?: string,
): Promise<OAuthProfile> {
  if (provider === "apple") {
    if (!idToken) throw new Error("Apple did not return an identity token.");
    const { payload } = await jwtVerify(
      idToken,
      createRemoteJWKSet(new URL("https://appleid.apple.com/auth/keys")),
      { issuer: "https://appleid.apple.com", audience: config.clientId },
    );
    const email = typeof payload.email === "string" ? payload.email : undefined;
    const verified =
      payload.email_verified === true || payload.email_verified === "true";
    return profileSchema.parse({
      id: payload.sub,
      email,
      emailVerified: verified,
    });
  }

  if (!config.profileEndpoint)
    throw new Error("OAuth profile endpoint is missing.");
  const response = await fetch(config.profileEndpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "User-Agent": "Legalnorms-Auth",
    },
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(
      `OAuth profile request failed with status ${response.status}.`,
    );
  const body: unknown = await response.json();

  if (provider === "github") {
    const user = z
      .object({ id: z.number(), name: z.string().nullable().optional() })
      .parse(body);
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    });
    const emails = emailResponse.ok
      ? z
          .array(
            z.object({
              email: z.string().email(),
              primary: z.boolean(),
              verified: z.boolean(),
            }),
          )
          .parse(await emailResponse.json())
      : [];
    const primary = emails.find((entry) => entry.primary && entry.verified);
    const [firstName, ...lastName] = (user.name ?? "").split(" ");
    return profileSchema.parse({
      id: String(user.id),
      email: primary?.email,
      emailVerified: Boolean(primary),
      firstName,
      lastName: lastName.join(" "),
    });
  }

  if (provider === "facebook") {
    const user = z
      .object({
        id: z.string(),
        email: z.string().email().optional(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
      })
      .parse(body);
    return profileSchema.parse({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    });
  }

  if (provider === "x") {
    const result = z
      .object({
        data: z.object({ id: z.string(), name: z.string().optional() }),
      })
      .parse(body).data;
    const [firstName, ...lastName] = (result.name ?? "").split(" ");
    return profileSchema.parse({
      id: result.id,
      firstName,
      lastName: lastName.join(" "),
    });
  }

  if (provider === "discord") {
    const user = z
      .object({
        id: z.string(),
        email: z.string().email().optional(),
        verified: z.boolean().optional(),
        global_name: z.string().optional(),
        username: z.string().optional(),
      })
      .parse(body);
    const [firstName, ...lastName] = (
      user.global_name ??
      user.username ??
      ""
    ).split(" ");
    return profileSchema.parse({
      id: user.id,
      email: user.email,
      emailVerified: user.verified ?? false,
      firstName,
      lastName: lastName.join(" "),
    });
  }

  const user = z
    .object({
      sub: z.string().optional(),
      id: z.union([z.string(), z.number()]).optional(),
      email: z.string().email().optional(),
      email_verified: z.boolean().optional(),
      given_name: z.string().optional(),
      family_name: z.string().optional(),
      name: z.string().optional(),
      picture: z.string().optional(),
    })
    .parse(body);
  const [firstName, ...lastName] = (user.name ?? "").split(" ");
  return profileSchema.parse({
    id: String(user.sub ?? user.id ?? ""),
    email: user.email,
    emailVerified: user.email_verified ?? false,
    firstName: user.given_name ?? firstName,
    lastName: user.family_name ?? lastName.join(" "),
    avatarUrl: user.picture,
  });
}

async function consumeOAuthState(provider: OAuthProvider, state: string) {
  const tokenHash = hashChallenge(state);
  const [challenge] = await db
    .select()
    .from(authChallenges)
    .where(
      and(
        eq(authChallenges.challengeType, "oauth_state"),
        eq(authChallenges.identifier, provider),
        eq(authChallenges.tokenHash, tokenHash),
        isNull(authChallenges.consumedAt),
        gt(authChallenges.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (!challenge) throw new Error("OAuth state is invalid or expired.");

  const [consumed] = await db
    .update(authChallenges)
    .set({ consumedAt: new Date() })
    .where(
      and(
        eq(authChallenges.id, challenge.id),
        isNull(authChallenges.consumedAt),
      ),
    )
    .returning();
  if (!consumed) throw new Error("OAuth state has already been used.");

  const metadata = z.object({ verifier: z.string() }).parse(challenge.metadata);
  return unsealSecret(metadata.verifier);
}

async function createOAuthAccount(
  provider: OAuthProvider,
  profile: OAuthProfile,
): Promise<"authenticated" | "pending" | "verify"> {
  const [linkedAccount] = await db
    .select({ userId: authAccounts.userId })
    .from(authAccounts)
    .where(
      and(
        eq(authAccounts.provider, provider),
        eq(authAccounts.providerAccountId, profile.id),
      ),
    )
    .limit(1);

  if (linkedAccount) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, linkedAccount.userId))
      .limit(1);
    if (!user?.emailVerified || !user.isActive)
      throw new Error("Verify your email before signing in.");
    
    if (profile.avatarUrl && user.avatarUrl !== profile.avatarUrl) {
      await db
        .update(users)
        .set({ avatarUrl: profile.avatarUrl })
        .where(eq(users.id, user.id));
    }
    
    await createSession(user.id);
    return "authenticated";
  }

  if (!profile.email) {
    const token = createOpaqueToken();
    await db.insert(authChallenges).values({
      challengeType: "oauth_completion",
      identifier: provider,
      tokenHash: hashChallenge(token),
      metadata: {
        providerAccountId: profile.id,
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
      },
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });
    const cookieStore = await cookies();
    cookieStore.set("legalnorms_oauth_pending", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });
    return "pending";
  }

  const email = profile.email.toLowerCase();
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing && (!profile.emailVerified || !existing.emailVerified)) {
    throw new Error(
      "This email already has an account. Sign in with that account first.",
    );
  }
  if (existing && !existing.isActive)
    throw new Error("This account is disabled.");

  const user = await db.transaction(async (transaction) => {
    if (existing) {
      if (profile.avatarUrl && !existing.avatarUrl) {
        await transaction
          .update(users)
          .set({ avatarUrl: profile.avatarUrl })
          .where(eq(users.id, existing.id));
      }
      await transaction.insert(authAccounts).values({
        userId: existing.id,
        provider,
        providerAccountId: profile.id,
      });
      return existing;
    }

    const [created] = await transaction
      .insert(users)
      .values({
        email,
        emailVerified: profile.emailVerified,
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
        roles: ["USER"],
      })
      .returning();
    await transaction.insert(authAccounts).values({
      userId: created.id,
      provider,
      providerAccountId: profile.id,
    });
    return created;
  });

  if (!user.emailVerified) {
    await sendOAuthVerification(user.id, email);
    return "verify";
  }
  await createSession(user.id);
  return "authenticated";
}

export async function completeOAuthCallback(
  provider: OAuthProvider,
  callbackParameters: URLSearchParams,
): Promise<"authenticated" | "pending" | "verify"> {
  const state = callbackParameters.get("state");
  if (!state) throw new Error("OAuth state is missing.");
  const verifier = await consumeOAuthState(provider, state);
  const config = providerConfig(provider);
  const client: oauth.Client = { client_id: config.clientId };
  const authorizationServer = providerAuthorizationServer(config);
  const validatedParameters = oauth.validateAuthResponse(
    authorizationServer,
    client,
    callbackParameters,
    state,
  );
  const clientSecret =
    typeof config.clientSecret === "function"
      ? await config.clientSecret()
      : config.clientSecret;
  const authentication =
    config.authMethod === "basic"
      ? oauth.ClientSecretBasic(clientSecret)
      : oauth.ClientSecretPost(clientSecret);
  const redirectUri = applicationUrl(`/api/auth/oauth/callback/${provider}`);
  const tokenResponse = await oauth.authorizationCodeGrantRequest(
    authorizationServer,
    client,
    authentication,
    validatedParameters,
    redirectUri,
    verifier,
  );
  const tokens = await oauth.processAuthorizationCodeResponse(
    authorizationServer,
    client,
    tokenResponse,
  );
  const profile = await providerProfile(
    provider,
    config,
    tokens.access_token,
    tokens.id_token,
  );
  return createOAuthAccount(provider, profile);
}

export async function consumePendingOAuthRegistration(token: string): Promise<{
  provider: OAuthProvider;
  accountId: string;
  firstName: string;
  lastName: string;
} | null> {
  const [challenge] = await db
    .select()
    .from(authChallenges)
    .where(
      and(
        eq(authChallenges.challengeType, "oauth_completion"),
        eq(authChallenges.tokenHash, hashChallenge(token)),
        isNull(authChallenges.consumedAt),
        gt(authChallenges.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (!challenge) return null;
  const metadata = z
    .object({
      providerAccountId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })
    .parse(challenge.metadata);
  if (!oauthProviders.includes(challenge.identifier as OAuthProvider))
    return null;

  const [consumed] = await db
    .update(authChallenges)
    .set({ consumedAt: new Date() })
    .where(
      and(
        eq(authChallenges.id, challenge.id),
        isNull(authChallenges.consumedAt),
      ),
    )
    .returning();
  if (!consumed) return null;

  return {
    provider: challenge.identifier as OAuthProvider,
    accountId: metadata.providerAccountId,
    firstName: metadata.firstName,
    lastName: metadata.lastName,
  };
}
