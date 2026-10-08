import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";
import { AlertsService } from "@/services/alerts.service";

const schema = z.object({
  eventType: z.string().trim().min(2).max(100),
  eventTitle: z.string().trim().min(2).max(255),
  eventTimestamp: z.string().transform((str) => new Date(str)),
  milestonePhase: z.string().trim().max(100).optional(),
  sourceUrl: z.string().trim().url().optional().or(z.literal("")),
  sourceName: z.string().trim().max(255).optional(),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    requirePermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD);

    const input = schema.parse(await readJson(request));
    const cleanUrl = input.sourceUrl === "" ? undefined : input.sourceUrl;

    const event = await AlertsService.createEvent({
      ...input,
      sourceUrl: cleanUrl,
    });
    return Response.json({ event });
  } catch (error) {
    return authErrorResponse(error);
  }
}
