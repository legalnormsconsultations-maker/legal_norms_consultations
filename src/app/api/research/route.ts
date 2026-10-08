import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { PERMISSIONS, requirePermission } from "@/lib/auth/rbac";
import { ResearchService } from "@/services/research.service";

const schema = z.object({
  title: z.string().trim().min(2),
  abstract: z.string().optional(),
  publisher: z.string().trim().optional(),
  doi: z.string().trim().optional(),
  url: z.string().trim().url().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    requirePermission(user, PERMISSIONS.VIEW_ADMIN_DASHBOARD);

    const input = schema.parse(await readJson(request));
    const cleanUrl = input.url === "" ? undefined : input.url;

    const article = await ResearchService.create({ ...input, url: cleanUrl });
    return Response.json({ article });
  } catch (error) {
    return authErrorResponse(error);
  }
}
