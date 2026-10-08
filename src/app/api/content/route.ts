import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/db";
import { cmsCategories, cmsContent } from "@/db/schema";

// GET all content (with pagination and optional category filtering)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const categoryId = searchParams.get("categoryId");

    let query = db
      .select({
        content: cmsContent,
        category: cmsCategories,
      })
      .from(cmsContent)
      .leftJoin(cmsCategories, eq(cmsContent.categoryId, cmsCategories.id));

    if (categoryId) {
      query = query.where(eq(cmsContent.categoryId, categoryId)) as any;
    }

    const data = await query.limit(limit);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// POST new content (API equivalent of Server Action)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      contentType,
      mediaUrl,
      thumbnailUrl,
      richTextBody,
      categoryId,
      mediaSizes,
      metadata,
      seoMetadata,
    } = body;

    if (!title || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Title and categoryId are required." },
        { status: 400 },
      );
    }

    const newContent = await db
      .insert(cmsContent)
      .values({
        title,
        slug: slug || uuidv4(),
        contentType: contentType || "document",
        mediaUrl,
        thumbnailUrl,
        richTextBody,
        categoryId,
        mediaSizes: mediaSizes || {},
        metadata: metadata || {},
        seoMetadata: seoMetadata || {},
        status: "published",
      })
      .returning();

    return NextResponse.json(
      { success: true, data: newContent[0] },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// PUT (Update) existing content
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required for updating." },
        { status: 400 },
      );
    }

    const updated = await db
      .update(cmsContent)
      .set(updates)
      .where(eq(cmsContent.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// DELETE existing content
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required." },
        { status: 400 },
      );
    }

    await db.delete(cmsContent).where(eq(cmsContent.id, id));

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
