import "server-only";

import { randomInt } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { authAccounts, authChallenges, authSessions, users } from "@/db/schema";
import { createOpaqueToken, hashChallenge } from "@/lib/auth/crypto";
import { sendEmail, sendSms } from "@/lib/auth/delivery";
import { consumeAuthLimit } from "@/lib/auth/rate-limit";
import { createSession } from "@/lib/auth/session";

const emailSchema = z.email().trim().toLowerCase();
const passwordSchema = z.string().min(12).max(128);
const challengeLifetimeMs = 1000 * 60 * 30;
const otpLifetimeMs = 1000 * 60 * 5;

function applicationUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return new URL(path, baseUrl).toString();
}

export async function createChallenge(input: {
  userId?: string;
  type: string;
  identifier: string;
  token: string;
  expiresAt: Date;
  metadata?: Record<string, string>;
}): Promise<void> {
  await db.insert(authChallenges).values({
    userId: input.userId,
    challengeType: input.type,
    identifier: input.identifier,
    tokenHash: hashChallenge(input.token),
    expiresAt: input.expiresAt,
    metadata: input.metadata,
  });
}

async function sendEmailChallenge(
  userId: string,
  email: string,
  type: "email_verification" | "password_reset",
): Promise<void> {
  await consumeAuthLimit({
    action: type,
    key: userId,
    maximum: 3,
    windowMs: 15 * 60 * 1000,
  });
  const token = createOpaqueToken();
  await createChallenge({
    userId,
    type,
    identifier: email,
    token,
    expiresAt: new Date(Date.now() + challengeLifetimeMs),
  });
  const path =
    type === "email_verification" ? "/verify-email" : "/reset-password";
  const url = new URL(path, applicationUrl("/"));
  url.searchParams.set("token", token);

  await sendEmail({
    to: email,
    subject:
      type === "email_verification"
        ? "Verify your email"
        : "Reset your password",
    text: `Complete this request using the link: ${url.toString()}`,
    html: `<p>Use the secure link below. It expires in 30 minutes.</p><p><a href="${url.toString()}">Continue</a></p>`,
  });
}

export async function sendOAuthVerification(
  userId: string,
  email: string,
): Promise<void> {
  await sendEmailChallenge(userId, email, "email_verification");
}

export async function registerWithPassword(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  pendingOAuth?: { provider: string; accountId: string };
}): Promise<void> {
  const firstName = z.string().trim().min(1).max(100).parse(input.firstName);
  const lastName = z.string().trim().min(1).max(100).parse(input.lastName);
  const email = emailSchema.parse(input.email);
  const password = passwordSchema.parse(input.password);
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const [user] = await db.transaction(async (transaction) => {
    const [createdUser] = await transaction
      .insert(users)
      .values({
        email,
        passwordHash,
        firstName,
        lastName,
        roles: ["USER"],
        emailVerified: false,
      })
      .returning();

    if (input.pendingOAuth) {
      await transaction.insert(authAccounts).values({
        userId: createdUser.id,
        provider: input.pendingOAuth.provider,
        providerAccountId: input.pendingOAuth.accountId,
      });
    }

    return [createdUser];
  });

  await sendEmailChallenge(user.id, email, "email_verification");
}

export async function loginWithPassword(
  emailInput: string,
  passwordInput: string,
): Promise<void> {
  const email = emailSchema.parse(emailInput);
  const password = z.string().min(1).max(128).parse(passwordInput);
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user?.passwordHash || !(await verify(user.passwordHash, password))) {
    throw new Error("Invalid email or password.");
  }
  if (!user.emailVerified)
    throw new Error("Verify your email before signing in.");
  if (!user.isActive) throw new Error("This account is disabled.");

  await createSession(user.id);
}

async function consumeChallenge(type: string, token: string) {
  const [challenge] = await db
    .select()
    .from(authChallenges)
    .where(
      and(
        eq(authChallenges.challengeType, type),
        eq(authChallenges.tokenHash, hashChallenge(token)),
        isNull(authChallenges.consumedAt),
        gt(authChallenges.expiresAt, new Date()),
      ),
    )
    .limit(1);
  if (!challenge) throw new Error("This link or code is invalid or expired.");

  const [consumed] = await db
    .update(authChallenges)
    .set({ consumedAt: new Date() })
    .where(
      and(
        eq(authChallenges.id, challenge.id),
        isNull(authChallenges.consumedAt),
        gt(authChallenges.expiresAt, new Date()),
      ),
    )
    .returning();
  if (!consumed) throw new Error("This link or code has already been used.");
  return challenge;
}

export async function verifyEmail(token: string): Promise<void> {
  const challenge = await consumeChallenge("email_verification", token);
  if (!challenge.userId) throw new Error("Invalid verification challenge.");
  await db
    .update(users)
    .set({ emailVerified: true, updatedAt: new Date() })
    .where(eq(users.id, challenge.userId));
  await createSession(challenge.userId);
}

export async function requestPasswordReset(emailInput: string): Promise<void> {
  const email = emailSchema.parse(emailInput);
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (user) await sendEmailChallenge(user.id, email, "password_reset");
}

export async function resetPassword(
  token: string,
  passwordInput: string,
): Promise<void> {
  const password = passwordSchema.parse(passwordInput);
  const challenge = await consumeChallenge("password_reset", token);
  if (!challenge.userId) throw new Error("Invalid password reset challenge.");
  const passwordHash = await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  await db.transaction(async (transaction) => {
    await transaction
      .update(users)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(users.id, challenge.userId as string));
    await transaction
      .update(authSessions)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(authSessions.userId, challenge.userId as string),
          isNull(authSessions.revokedAt),
        ),
      );
  });
}

export async function resendEmailVerification(
  emailInput: string,
): Promise<void> {
  const email = emailSchema.parse(emailInput);
  const [user] = await db
    .select({ id: users.id, emailVerified: users.emailVerified })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (user && !user.emailVerified) {
    await sendEmailChallenge(user.id, email, "email_verification");
  }
}

export async function requestPhoneOtp(
  phoneInput: string,
  mode: "login" | "enroll",
  userId?: string,
): Promise<void> {
  const phone = z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/)
    .parse(phoneInput);
  const [user] =
    mode === "login"
      ? await db
          .select()
          .from(users)
          .where(
            and(eq(users.phoneNumber, phone), eq(users.phoneVerified, true)),
          )
          .limit(1)
      : userId
        ? await db.select().from(users).where(eq(users.id, userId)).limit(1)
        : [];

  if (!user || !user.emailVerified || !user.isActive) {
    throw new Error("This phone number cannot be used for this account.");
  }
  if (mode === "enroll") {
    const [phoneOwner] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.phoneNumber, phone), eq(users.phoneVerified, true)))
      .limit(1);
    if (phoneOwner && phoneOwner.id !== user.id) {
      throw new Error("This phone number cannot be used for this account.");
    }
  }

  const type = mode === "login" ? "phone_login" : "phone_enroll";
  const recentChallenges = await db
    .select({ id: authChallenges.id })
    .from(authChallenges)
    .where(
      and(
        eq(authChallenges.userId, user.id),
        eq(authChallenges.challengeType, type),
        gt(authChallenges.createdAt, new Date(Date.now() - 15 * 60 * 1000)),
      ),
    )
    .limit(3);
  if (recentChallenges.length >= 3) {
    throw new Error("Too many code requests. Try again in 15 minutes.");
  }

  const otp = String(randomInt(100000, 1000000));
  await createChallenge({
    userId: user.id,
    type,
    identifier: phone,
    token: otp,
    expiresAt: new Date(Date.now() + otpLifetimeMs),
  });
  await sendSms(
    phone,
    `Your Legalnorms verification code is ${otp}. It expires in 5 minutes.`,
  );
}

export async function verifyPhoneOtp(
  phoneInput: string,
  otpInput: string,
  mode: "login" | "enroll",
  userId?: string,
): Promise<void> {
  const phone = z
    .string()
    .regex(/^\+[1-9]\d{7,14}$/)
    .parse(phoneInput);
  const otp = z
    .string()
    .regex(/^\d{6}$/)
    .parse(otpInput);
  const type = mode === "login" ? "phone_login" : "phone_enroll";
  const [challenge] = await db
    .select()
    .from(authChallenges)
    .where(
      and(
        eq(authChallenges.challengeType, type),
        eq(authChallenges.identifier, phone),
        isNull(authChallenges.consumedAt),
        gt(authChallenges.expiresAt, new Date()),
      ),
    )
    .orderBy(sql`${authChallenges.createdAt} desc`)
    .limit(1);
  if (
    !challenge?.userId ||
    (mode === "enroll" && challenge.userId !== userId)
  ) {
    throw new Error("Invalid or expired verification code.");
  }
  if (challenge.attempts >= 5)
    throw new Error("Too many attempts. Request a new code.");
  if (challenge.tokenHash !== hashChallenge(otp)) {
    await db
      .update(authChallenges)
      .set({ attempts: sql`${authChallenges.attempts} + 1` })
      .where(eq(authChallenges.id, challenge.id));
    throw new Error("Invalid or expired verification code.");
  }

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
  if (!consumed)
    throw new Error("This verification code has already been used.");

  await db
    .update(users)
    .set({ phoneNumber: phone, phoneVerified: true, updatedAt: new Date() })
    .where(eq(users.id, challenge.userId));
  if (mode === "login") await createSession(challenge.userId);
}
