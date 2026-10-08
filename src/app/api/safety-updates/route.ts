import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";
import { AlertsService } from "@/services/alerts.service";

const schema = z.object({
  title: z.string().trim().min(2).max(255),
  severity: z.string().trim().min(2).max(50),
  description: z.string().trim().min(2),
  issuedDate: z.string().transform((str) => new Date(str)),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    requirePermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD);

    const input = schema.parse(await readJson(request));

    const update = await AlertsService.createSafetyUpdate(input);
    return Response.json({ update });
  } catch (error) {
    return authErrorResponse(error);
  }
}
