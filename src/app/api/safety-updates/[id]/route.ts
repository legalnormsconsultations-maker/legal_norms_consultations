import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";
import { AlertsService } from "@/services/alerts.service";

const schema = z.object({
  title: z.string().trim().min(2).max(255).optional(),
  severity: z.string().trim().min(2).max(50).optional(),
  description: z.string().trim().min(2).optional(),
  issuedDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    requirePermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD);

    const { id } = await context.params;
    const input = schema.parse(await readJson(request));

    const update = await AlertsService.updateSafetyUpdate(id, input);
    return Response.json({ update });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    requirePermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD);

    const { id } = await context.params;
    await AlertsService.removeSafetyUpdate(id);
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
