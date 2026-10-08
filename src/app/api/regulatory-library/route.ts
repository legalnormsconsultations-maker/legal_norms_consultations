import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";
import { RegulatoryLibraryService } from "@/services/regulatory-library.service";

const resourceSchema = z.object({
  authority: z.string().trim().min(2).max(255),
  title: z.string().trim().min(2).max(255),
  url: z.string().trim().url(),
  description: z.string().trim().min(5),
  category: z.string().trim().min(2).max(100),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Sign in required." }, { status: 401 });

  const resources = await RegulatoryLibraryService.list();
  return Response.json({ resources });
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    // Require admin or specific permission to create a resource
    requirePermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD);

    const input = resourceSchema.parse(await readJson(request));
    const resource = await RegulatoryLibraryService.create(input);
    return Response.json({ resource });
  } catch (error) {
    return authErrorResponse(error);
  }
}
