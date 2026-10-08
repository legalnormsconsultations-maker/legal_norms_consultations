import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { fdaGuidances } from "@/db/schema";

export async function GET() {
  try {
    const guidances = await db
      .select()
      .from(fdaGuidances)
      .orderBy(desc(fdaGuidances.issueDate));
    return NextResponse.json(guidances);
  } catch (error) {
    console.error("Error fetching FDA guidances:", error);
    return NextResponse.json(
      { error: "Failed to fetch guidances" },
      { status: 500 },
    );
  }
}
