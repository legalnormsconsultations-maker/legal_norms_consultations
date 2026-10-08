import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cmsCategories } from "@/db/schema";

// GET all categories
export async function GET(req: NextRequest) {
  try {
    const categories = await db.select().from(cmsCategories);
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST new category
export async function POST(req: NextRequest) {
  try {
    const { name, slug, themeGradient, description } = await req.json();

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required." },
        { status: 400 },
      );
    }

    const newCategory = await db
      .insert(cmsCategories)
      .values({
        name,
        slug,
        themeGradient: themeGradient || "from-slate-800 to-slate-900",
        description,
      })
      .returning();

    return NextResponse.json(
      { success: true, data: newCategory[0] },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
