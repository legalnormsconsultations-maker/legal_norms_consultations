import { cookies } from "next/headers";
import { z } from "zod";
import { registerWithPassword } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { consumePendingOAuthRegistration } from "@/lib/auth/oauth";
import { consumeAuthLimit } from "@/lib/auth/rate-limit";

const schema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(12).max(128),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = schema.parse(await readJson(request));
    const remoteAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    await consumeAuthLimit({
      action: "signup",
      key: remoteAddress,
      maximum: 8,
      windowMs: 60 * 60 * 1000,
    });
    const cookieStore = await cookies();
    const pendingToken = cookieStore.get("legalnorms_oauth_pending")?.value;
    const pendingOAuth = pendingToken
      ? await consumePendingOAuthRegistration(pendingToken)
      : null;

    await registerWithPassword({
      ...input,
      pendingOAuth: pendingOAuth ?? undefined,
    });
    cookieStore.delete("legalnorms_oauth_pending");
    return Response.json(
      { message: "Check your email for the verification link." },
      { status: 201 },
    );
  } catch (error) {
    return authErrorResponse(error);
  }
}
