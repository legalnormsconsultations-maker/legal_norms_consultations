import { revokeCurrentSession } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse } from "@/lib/auth/http";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    await revokeCurrentSession();
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
