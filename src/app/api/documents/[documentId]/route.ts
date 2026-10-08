import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse, readJson } from "@/lib/auth/http";
import {
  deleteRegulatoryDocument,
  updateRegulatoryDocument,
} from "@/services/documents.service";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  documentType: z.string().min(1).optional(),
  drugId: z.string().nullable().optional(),
  authorityId: z.string().nullable().optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ documentId: string }> },
) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { documentId } = await context.params;
    const body = await readJson(request);
    const data = updateSchema.parse(body);

    const updatedDoc = await updateRegulatoryDocument(user, documentId, data);
    return NextResponse.json({ document: updatedDoc });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ documentId: string }> },
) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const { documentId } = await context.params;
    await deleteRegulatoryDocument(user, documentId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return authErrorResponse(error);
  }
}
