import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import { updateImportComplianceTask } from "@/services/import-compliance.service";

const updateSchema = z.object({ isComplete: z.boolean() });

export async function PATCH(
  request: Request,
  context: { params: Promise<{ caseId: string; taskId: string }> },
) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    const { caseId, taskId } = await context.params;
    const { isComplete } = updateSchema.parse(await readJson(request));
    await updateImportComplianceTask(user, caseId, taskId, isComplete);
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
