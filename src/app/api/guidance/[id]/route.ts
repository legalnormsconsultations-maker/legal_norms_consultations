import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { fdaGuidances } from "@/db/schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const docketNumber = decodeURIComponent(resolvedParams.id);
    const guidanceRecords = await db
      .select()
      .from(fdaGuidances)
      .where(eq(fdaGuidances.docketNumber, docketNumber))
      .limit(1);

    const guidance = guidanceRecords[0];

    if (!guidance) {
      return NextResponse.json(
        { error: "Guidance not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(guidance);
  } catch (error) {
    console.error("Error fetching FDA guidance:", error);
    return NextResponse.json(
      { error: "Failed to fetch guidance" },
      { status: 500 },
    );
  }
}
