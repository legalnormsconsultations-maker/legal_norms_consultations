import { z } from "zod";
import { requestPasswordReset } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { consumeAuthLimit } from "@/lib/auth/rate-limit";

const schema = z.object({ email: z.email() });

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { email } = schema.parse(await readJson(request));
    const remoteAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    await consumeAuthLimit({
      action: "password-reset",
      key: `${remoteAddress}:${email.toLowerCase()}`,
      maximum: 5,
      windowMs: 60 * 60 * 1000,
    });
    await requestPasswordReset(email);
    return Response.json({
      message: "If an account exists, a reset email has been sent.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
