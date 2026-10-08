import { randomUUID } from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { PortfolioService } from "@/services/portfolio.service";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    const requestId = request.headers.get("x-request-id") ?? randomUUID();
    const item = await PortfolioService.create(
      user,
      requestId,
      await readJson(request),
    );
    return Response.json({ item }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
