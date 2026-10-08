import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";
import { ManufacturerService } from "@/services/manufacturer.service";

const schema = z.object({
  name: z.string().trim().min(2).max(255).optional(),
  country: z.string().trim().max(100).optional(),
  headquarters: z.string().trim().max(255).optional(),
  websiteUrl: z.string().trim().url().optional().or(z.literal("")),
  companyProfile: z.string().optional(),
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
    const cleanUrl = input.websiteUrl === "" ? undefined : input.websiteUrl;

    const manufacturer = await ManufacturerService.update(id, {
      ...input,
      websiteUrl: cleanUrl,
    });
    return Response.json({ manufacturer });
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
    await ManufacturerService.remove(id);
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
