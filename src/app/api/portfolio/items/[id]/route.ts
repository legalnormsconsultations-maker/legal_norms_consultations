import { randomUUID } from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { PortfolioService } from "@/services/portfolio.service";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    const { id } = await context.params;
    const requestId = request.headers.get("x-request-id") ?? randomUUID();
    await PortfolioService.remove(user, requestId, id);
    return Response.json({ success: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    const { id } = await context.params;
    const requestId = request.headers.get("x-request-id") ?? randomUUID();
    const item = await PortfolioService.update(
      user,
      requestId,
      id,
      await readJson(request),
    );
    return Response.json({ item });
  } catch (error) {
    return authErrorResponse(error);
  }
}
