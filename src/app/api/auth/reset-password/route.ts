import { z } from "zod";
import { resetPassword } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";

const schema = z.object({
  token: z.string().min(32),
  password: z.string().min(12).max(128),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = schema.parse(await readJson(request));
    await resetPassword(input.token, input.password);
    return Response.json({ message: "Password updated. Please sign in." });
  } catch (error) {
    return authErrorResponse(error);
  }
}
