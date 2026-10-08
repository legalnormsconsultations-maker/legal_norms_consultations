import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import {
  createImportComplianceCase,
  listImportComplianceCases,
} from "@/services/import-compliance.service";

export async function GET() {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Sign in required." }, { status: 401 });
  return Response.json({ cases: await listImportComplianceCases(user) });
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    const created = await createImportComplianceCase(
      user,
      await readJson(request),
    );
    return Response.json({ case: created }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
