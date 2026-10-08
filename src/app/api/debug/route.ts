import { NextResponse } from "next/server";
import { db } from "@/db";
import { regulatorySignals } from "@/db/schema";
import { count } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "NOT_SET";
  const maskedUrl = dbUrl.replace(/:[^:@]+@/, ":***@");

  try {
    const result = await db.select({ total: count() }).from(regulatorySignals);
    return NextResponse.json({
      status: "success",
      dbUrl: maskedUrl,
      count: result[0]?.total,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      dbUrl: maskedUrl,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}
