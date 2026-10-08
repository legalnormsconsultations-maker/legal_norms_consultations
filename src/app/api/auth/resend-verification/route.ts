import { z } from "zod";
import { resendEmailVerification } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";

const schema = z.object({ email: z.email() });

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const { email } = schema.parse(await readJson(request));
    await resendEmailVerification(email);
    return Response.json({
      message: "If that account needs verification, an email has been sent.",
    });
  } catch (error) {
    return authErrorResponse(error);
  }
}
