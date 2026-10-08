import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiSecurity } from "@/lib/api-security";
import { CatalogService } from "@/services/catalog.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const page = searchParams.get("page") ?? undefined;

    const data = await CatalogService.listDrugs({ q, page });
    return NextResponse.json(data);
  } catch (error) {
    console.error("[API] GET /api/drugs Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    await ApiSecurity.validateRequest(["admin"]);
    return NextResponse.json({ error: "Not Implemented Yet" }, { status: 501 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNAUTHORIZED")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
