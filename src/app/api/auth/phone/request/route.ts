import { z } from "zod";
import { getCurrentUser, requestPhoneOtp } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { consumeAuthLimit } from "@/lib/auth/rate-limit";

const schema = z.object({
  phone: z.string(),
  mode: z.enum(["login", "enroll"]),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const input = schema.parse(await readJson(request));
    const remoteAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    await consumeAuthLimit({
      action: "phone-otp",
      key: `${remoteAddress}:${input.phone}`,
      maximum: 5,
      windowMs: 15 * 60 * 1000,
    });
    const currentUser = input.mode === "enroll" ? await getCurrentUser() : null;
    if (input.mode === "enroll" && !currentUser) {
      return Response.json(
        { error: "Sign in before adding a phone number." },
        { status: 401 },
      );
    }
    try {
      await requestPhoneOtp(input.phone, input.mode, currentUser?.id);
    } catch (error) {
      if (
        input.mode === "login" &&
        error instanceof Error &&
        error.message === "This phone number cannot be used for this account."
      ) {
        return Response.json({
          message:
            "If this phone is eligible, a verification code has been sent.",
        });
      }
      throw error;
    }
    return Response.json({
      message: "If this phone is eligible, a verification code has been sent.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
