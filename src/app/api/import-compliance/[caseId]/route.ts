import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import {
  deleteImportComplianceCase,
  getImportComplianceCase,
  updateImportComplianceCase,
} from "@/services/import-compliance.service";

const updateSchema = z.object({
  productName: z.string().trim().min(2).max(255).optional(),
  applicantName: z.string().trim().min(2).max(255).optional(),
  countryOfOrigin: z.string().trim().min(2).max(100).optional(),
  productType: z
    .enum([
      "DRUG",
      "BIOLOGICAL",
      "API",
      "MEDICAL_DEVICE",
      "IVD",
      "COSMETIC",
      "FOOD_NUTRACEUTICAL",
      "LEGAL_METROLOGY",
      "EPR",
      "NARCOTIC",
      "WIRELESS",
      "BIS",
      "VETERINARY",
      "AYUSH",
      "OTHER",
    ])
    .optional(),
  importLicenseExpiresAt: z.string().nullable().optional(),
});

export async function GET(
  _request: Request,
  context: { params: Promise<{ caseId: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return Response.json({ error: "Sign in required." }, { status: 401 });
  const { caseId } = await context.params;
  const complianceCase = await getImportComplianceCase(user, caseId);
  if (!complianceCase) {
    return Response.json(
      { error: "Compliance case not found." },
      { status: 404 },
    );
  }
  return Response.json({ case: complianceCase });
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ caseId: string }> },
) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    const { caseId } = await context.params;
    const input = updateSchema.parse(await readJson(request));
    await updateImportComplianceCase(user, caseId, input);
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ caseId: string }> },
) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user)
      return Response.json({ error: "Sign in required." }, { status: 401 });
    const { caseId } = await context.params;
    await deleteImportComplianceCase(user, caseId);
    return Response.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
