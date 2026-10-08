import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";
import { RegulatoryLibraryService } from "@/services/regulatory-library.service";

const updateSchema = z.object({
  authority: z.string().trim().min(2).max(255).optional(),
  title: z.string().trim().min(2).max(255).optional(),
  url: z.string().trim().url().optional(),
  description: z.string().trim().min(5).optional(),
  category: z.string().trim().min(2).max(100).optional(),
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
    const input = updateSchema.parse(await readJson(request));
    const resource = await RegulatoryLibraryService.update(id, input);
    return Response.json({ resource });
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
    await RegulatoryLibraryService.remove(id);
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
