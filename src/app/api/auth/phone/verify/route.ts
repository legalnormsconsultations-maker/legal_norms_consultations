import { z } from "zod";
import { getCurrentUser, verifyPhoneOtp } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";

const schema = z.object({
  phone: z.string(),
  code: z.string(),
  mode: z.enum(["login", "enroll"]),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = schema.parse(await readJson(request));
    const currentUser = input.mode === "enroll" ? await getCurrentUser() : null;
    if (input.mode === "enroll" && !currentUser) {
      return Response.json(
        { error: "Sign in before adding a phone number." },
        { status: 401 },
      );
    }
    await verifyPhoneOtp(input.phone, input.code, input.mode, currentUser?.id);
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
