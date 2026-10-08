import { z } from "zod";

export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? request.url,
  ).origin;
  if (!origin || new URL(origin).origin !== expectedOrigin) {
    throw new Response("Invalid request origin.", { status: 403 });
  }
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new Response("Invalid JSON body.", { status: 400 });
  }
}

export function authErrorResponse(error: unknown): Response {
  if (error instanceof Response) return error;
  if (error instanceof z.ZodError) {
    return Response.json(
      { error: error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  if (error instanceof Error) {
    const publicMessages = [
      "Invalid email or password.",
      "Verify your email before signing in.",
      "This account is disabled.",
      "This link or code is invalid or expired.",
      "This link or code has already been used.",
      "Invalid verification challenge.",
      "Invalid password reset challenge.",
      "Invalid or expired verification code.",
      "This verification code has already been used.",
      "Too many attempts. Request a new code.",
      "This phone number cannot be used for this account.",
      "Too many code requests. Try again in 15 minutes.",
      "Too many requests. Try again later.",
      "This email already has an account. Sign in with that account first.",
      "OAuth state is invalid or expired.",
      "OAuth state has already been used.",
      "OAuth state is missing.",
      "Enter a valid license expiry date.",
      "Compliance case not found.",
      "Compliance task not found.",
    ];
    if (publicMessages.includes(error.message)) {
      const status =
        error.message === "Invalid email or password."
          ? 401
          : error.message === "Too many requests. Try again later."
            ? 429
            : error.message === "Compliance case not found." ||
                error.message === "Compliance task not found."
              ? 404
              : 400;
      return Response.json({ error: error.message }, { status });
    }
  }

  return Response.json(
    { error: "Authentication request failed." },
    { status: 500 },
  );
}
