import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { assertSameOrigin, authErrorResponse } from "@/lib/auth/http";
import { uploadRegulatoryDocument } from "@/services/documents.service";

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const documentType = formData.get("documentType") as string | null;
    const drugId = formData.get("drugId") as string | null;
    const authorityId = formData.get("authorityId") as string | null;

    if (!file || !title || !documentType) {
      return NextResponse.json(
        { error: "Missing required fields: file, title, and documentType." },
        { status: 400 },
      );
    }

    const newDoc = await uploadRegulatoryDocument(
      user,
      file,
      title,
      documentType,
      drugId || undefined,
      authorityId || undefined,
    );

    return NextResponse.json({ document: newDoc }, { status: 201 });
  } catch (error) {
    return authErrorResponse(error);
  }
}
