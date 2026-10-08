import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";
import { ManufacturerService } from "@/services/manufacturer.service";

const schema = z.object({
  name: z.string().trim().min(2).max(255),
  country: z.string().trim().max(100).optional(),
  headquarters: z.string().trim().max(255).optional(),
  websiteUrl: z.string().trim().url().optional().or(z.literal("")),
  companyProfile: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    requirePermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD); // Or more specific admin permission

    const input = schema.parse(await readJson(request));
    const cleanUrl = input.websiteUrl === "" ? undefined : input.websiteUrl;

    const manufacturer = await ManufacturerService.create({
      ...input,
      websiteUrl: cleanUrl,
    });
    return Response.json({ manufacturer });
  } catch (error) {
    return authErrorResponse(error);
  }
}
