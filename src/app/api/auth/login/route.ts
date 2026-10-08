import { z } from "zod";
import { loginWithPassword } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { consumeAuthLimit } from "@/lib/auth/rate-limit";

const schema = z.object({
  email: z.email(),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = schema.parse(await readJson(request));
    const remoteAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    await consumeAuthLimit({
      action: "login",
      key: `${remoteAddress}:${input.email.toLowerCase()}`,
      maximum: 10,
      windowMs: 15 * 60 * 1000,
    });
    await loginWithPassword(input.email, input.password);
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
